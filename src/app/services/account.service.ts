import { Injectable } from '@angular/core';
import { UtilService } from './util.service';
import { ApiService } from './api.service';
import { AppSettingsService } from './app-settings.service';
import { WalletStoreEnum } from '../enums/wallet-store.enum';
import { IDpkiGetPublishBlockRequest } from '../interfaces/api.interface';
import { SocialTypeEnum } from '../enums/social-type.enum';
import { MainHelper } from '../helpers/main.helper';
import { IAccount } from '../interfaces/app.interface';
import { environment } from '../../environments/environment';

const nacl = window['nacl'];

@Injectable({
    providedIn: 'root'
})
export class AccountService {
    private _storeKey = `qlc-confidant`;

    /**
     * @constructor
     * @param {UtilService} _utilService
     * @param {ApiService} _apiService
     * @param {AppSettingsService} _appSettingsService
     */
    constructor(
        private _utilService: UtilService,
        private _apiService: ApiService,
        private _appSettingsService: AppSettingsService
    ) {
    }

    /**
     * @private
     * @method getItem
     * @returns IAccount
     */
    private _getAccount(): IAccount {
        return JSON.parse(localStorage.getItem(this._storeKey));
    }

    /**
     * @private
     * @method _removeAccount
     */
    private _removeAccount(): void {
        localStorage.removeItem(this._storeKey);
    }

    /**
     * @private
     * @param {IAccount} account
     * @method _saveAccount
     */
    private _saveAccount(account: IAccount): void {
        switch (this._appSettingsService.appSetting.walletStore) {
            case WalletStoreEnum.NONE:
                this._removeAccount();
                break;
            default:
            case WalletStoreEnum.LOCAL_STORAGE:
                localStorage.setItem(this._storeKey, JSON.stringify(account));
                break;
        }
    }

    /**
     * @method create
     * @returns Promise<void>
     */
    async create(): Promise<void> {
        const newAccount = await this._apiService.account_newAccounts();

        const account = newAccount.result[0];
        this._saveAccount(account);
    }

    /**
     * @method createFromSeed
     * @param {string} seed
     * @returns Promise<void>
     */
    async createFromSeed(seed: string): Promise<void> {
        const accountCreate = await this._apiService.account_create(seed);
        const address = await this._apiService.account_forPublicKey(accountCreate.result.pubKey);

        const account = {
            seed: seed,
            privateKey: accountCreate.result.privKey,
            publicKey: accountCreate.result.pubKey,
            address: address.result
        };

        this._saveAccount(account);
    }

    /**
     * @method updateChain
     * @param {SocialTypeEnum} socialType
     * @returns Promise<void>
     */
    async updateChain(socialType: SocialTypeEnum = SocialTypeEnum.EMAIL): Promise<void> {
        const verifiers = await this._apiService.dpki_getAllVerifiers();
        const account = this._getAccount();
        const verifierAddress = (verifiers.result.find(a => a.account)).account;
        // const verifiersAddresses = verifiers.result.map(a => a.account);
        const dpkiGetPublishBlock: IDpkiGetPublishBlockRequest = {
            account: account.address,
            type: socialType,
            id: account.social[socialType].id,
            pubKey: account.publicKey,
            fee: environment.chain.fee,
            verifiers: [verifierAddress]
        };

        const publishBlock = await this._apiService.dpki_getPublishBlock(dpkiGetPublishBlock);
        const accountBytes = this._utilService.account.generateAccountSecretKeyBytes(this._utilService.hex.toUint8(account.seed), 0);
        const accountKeyPair = this._utilService.account.generateAccountKeyPair(accountBytes);
        const blockHash = await this._apiService.ledger_blockHash(publishBlock.result.block);
        const signed = nacl.sign.detached(this._utilService.hex.toUint8(blockHash.result), accountKeyPair.secretKey);
        publishBlock.result.block.signature = this._utilService.hex.fromUint8(signed);
        ;

        const blockHashUpdate = await this._apiService.ledger_process(publishBlock.result.block);

        // const dpkiGetPubKeyByTypeAndID: any = {
        //     type: socialType,
        //     id: 'dtacer@gmail.com'
        // };
        //
        // const account = await this._apiService.dpki_getPubKeyByTypeAndID(dpkiGetPubKeyByTypeAndID);
        // console.log(account);
    }

    /**
     * @method socialConnect
     * @param {SocialTypeEnum} socialType
     * @param {string} id
     * @returns number
     */
    socialConnect(socialType: SocialTypeEnum, id?: string): number {
        switch (socialType) {
            case SocialTypeEnum.EMAIL:
                const code: number = MainHelper.GetRandomNumber();
                const account = this._getAccount();

                account.social = {
                    email: {
                        validated: false,
                        id,
                        code
                    }
                };

                this._saveAccount(account);

                return code;
        }
    }

    /**
     * @method socialVerify
     * @param {SocialTypeEnum} socialType
     * @param {number} code
     * @returns boolean
     */
    async socialVerify(socialType: SocialTypeEnum, code?: number): Promise<boolean> {
        switch (socialType) {
            case SocialTypeEnum.EMAIL:
                const account = this._getAccount();

                if (account.social.email.code === code) {
                    account.social.email.validated = true;

                    this._saveAccount(account);

                    await this.updateChain(socialType);

                    return true;
                }

                return false;
        }
    }
}

