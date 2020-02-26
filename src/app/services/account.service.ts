import { Injectable } from '@angular/core';
import { UtilService } from './util.service';
import { ApiService } from './api.service';
import { SocialTypeEnum } from '../enums/social-type.enum';
import { MainHelper } from '../helpers/main.helper';
import { IAccount } from '../interfaces/app.interface';
import { environment } from '../../environments/environment';
import { LibsodiumService } from './libsodium.service';
import { WalletStoreEnum } from '../enums/wallet-store.enum';
import { AppSettingsService } from './app-settings.service';

const nacl = window['nacl'];

@Injectable({
    providedIn: 'root'
})
export class AccountService {
    /**
     * @constructor
     * @param {ApiService} _apiService
     * @param {AppSettingsService} _appSettingsService
     * @param {LibsodiumService} _libsodiumService
     * @param {UtilService} _utilService
     */
    constructor(
        private _apiService: ApiService,
        private _appSettingsService: AppSettingsService,
        private _libsodiumService: LibsodiumService,
        private _utilService: UtilService
    ) {
        _libsodiumService.setAccount(this.getAccount());
    }

    /**
     * @method create
     * @returns Promise<void>
     */
    async create(): Promise<IAccount> {
        const newAccount = await this._apiService.account_newAccounts();
        const account: IAccount = newAccount.result[0];

        account.encryption = this._libsodiumService.generateEncryption();

        this.saveAccount(account);

        return account;
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
            address: address.result,
            encryption: this._libsodiumService.generateEncryption()
        };

        this.saveAccount(account);
    }

    /**
     * @method deleteAccount
     */
    deleteAccount(): void {
        localStorage.removeItem(environment.localStorageKey);
    }

    /**
     * @method getAccount
     * @returns IAccount
     */
    getAccount(): IAccount {
        return JSON.parse(localStorage.getItem(environment.localStorageKey));
    }

    /**
     * @method socialVerify
     * @param {SocialTypeEnum} socialType
     * @param {string} id
     * @returns boolean
     */
    async getAccountByTypeAndId(socialType: SocialTypeEnum, id?: string): Promise<any[]> {
        const dpkiGetPubKeyByTypeAndID: any = {
            type: socialType,
            id: id
        };

        const response = await this._apiService.dpki_getPubKeyByTypeAndID(dpkiGetPubKeyByTypeAndID);

        return response.result;
    }

    /**
     * @method saveAccount
     * @param {IAccount} account
     */
    saveAccount(account: IAccount): void {
        switch (this._appSettingsService.appSetting.walletStore) {
            case WalletStoreEnum.NONE:
                this.deleteAccount();
                break;
            default:
            case WalletStoreEnum.LOCAL_STORAGE:
                localStorage.setItem(environment.localStorageKey, JSON.stringify(account));
                break;
        }
    }

    /**
     * @method encrypt
     * @returns {string}
     */
    encrypt(message): string {
        return this._libsodiumService.encrypt(message);
    }

    /**
     * @method encryptFriend
     * @returns {string}
     */
    encryptFriend(message): string {
        return this._libsodiumService.encryptFriend(message);
    }

    /**
     * @method decrypt
     * @param {string} encryptedMessageFriend
     */
    decrypt(encryptedMessageFriend): string {
        return this._libsodiumService.decrypt(encryptedMessageFriend);
    }

    /**
     * @method decryptFriend
     * @param {string} encryptedMessageFriend
     */
    decryptFriend(encryptedMessageFriend): string {
        return this._libsodiumService.decryptFriend(encryptedMessageFriend);
    }

    /**
     * @method updateChain
     * @param {SocialTypeEnum} socialType
     * @returns Promise<void>
     */
    async updateChain(socialType: SocialTypeEnum = SocialTypeEnum.EMAIL): Promise<boolean> {
        // const verifiers = await this._apiService.dpki_getAllVerifiers();
        // console.log('verifiers');
        // console.log(verifiers);
        const account = this.getAccount();
        // const verifierAddress = (verifiers.result.find(a => a.account)).account;
        // const verifiersAddresses = verifiers.result.map(a => a.account);
        // const dpkiGetPublishBlockRequest: IDpkiGetPublishBlockRequest = {
        //     account: account.address,
        //     type: socialType,
        //     id: account.social[socialType].id,
        //     pubKey: account.publicKey,
        //     fee: environment.chain.fee,
        //     verifiers: [verifiersAddresses[0], verifiersAddresses[1], verifiersAddresses[2]]
        // };
        // console.log('dpkiGetPublishBlockRequest');
        // console.log(dpkiGetPublishBlockRequest);
        //
        // const publishBlock = await this._apiService.dpki_getPublishBlock(dpkiGetPublishBlockRequest);
        // console.log('publishBlock');
        // console.log(publishBlock);
        const accountBytes = this._utilService.account.generateAccountSecretKeyBytes(this._utilService.hex.toUint8(account.seed), 0);
        const accountKeyPair = this._utilService.account.generateAccountKeyPair(accountBytes);
        // const blockHash = await this._apiService.ledger_blockHash(publishBlock.result.block);
        // const signed = nacl.sign.detached(this._utilService.hex.toUint8(blockHash.result), accountKeyPair.secretKey);
        // publishBlock.result.block.signature = this._utilService.hex.fromUint8(signed);
        //
        // const dpkiGetOracleInfosByTypeAndIdRequest: IDpkiGetOracleInfosByTypeAndIdRequest = {
        //     type: socialType,
        //     id: 'david123@gmail.com'
        //     // id: '0a870e92b888afe398006ec59d6a8a5cce8d4279932a41995a5a1bbf9d892e38'
        // };
        //
        // const response = await this._apiService.dpki_getOracleInfosByTypeAndID(dpkiGetOracleInfosByTypeAndIdRequest);
        //
        // console.log('RESPONSE');
        // console.log(response);
        // //
        // // const publichBlockVerifiers = Object.keys(publishBlock.result.verifiers);
        // //
        // // console.log(publichBlockVerifiers);
        // // console.log(publichBlockVerifiers[0]);
        // const dpkiGetOracleBlockRequest: IDpkiGetOracleBlockRequest = {
        //     // account: account.address,
        //     account: 'qlc_176iqjxz1tif1m8xarzhzhwg5b1dtgmmp1g1emb5d1bij18ahwwhsyoaqc8m', // VERIFIER ACCOUNT ID
        //     // account: 'qlc_34gmbj5397z5j5kta5h1a58s5ucqrjux6msthzmwunzuaopuoje7qknysxtd',
        //     type: socialType, // TYPE EMAIL
        //     // id: 'dta',
        //     id: 'david123@gmail.com', // ID EMAIL ADDRESS
        //     // id: account.social[socialType].id,
        //     // pk: account.publicKey,
        //     // pk: publishBlock.result.verifiers[publichBlockVerifiers[0]].pubKey,
        //     // code: publishBlock.result.verifiers[publichBlockVerifiers[0]].code,
        //     // hash: publishBlock.result.verifiers[publichBlockVerifiers[0]].hash
        //     pk: '89d34c461397e388e5a40de040cd91ed57c477d24f3a7fe7cdd3fb456dbac585', // MOJ PUBLIC KEY, KI SEM GAL DAL PRI GET PUBLISH BLOCK ... ISTI PUB KEY IMAJO POTEM VSI VERIFIERJI, KI SE JIH PODA PRI getPublishBlock klicu
        //     code: 'sdteMriNpv4MDpQf', // CODE, KI GA VRNE getPublishBlock od verifierja
        //     hash: '4102bcf9e977dd5a509b8277b5c8b41ca1080adbce4b9ce078ab0e06c72cbed1' // HASH ki ga vrne klic dpki_getPubKeyByTypeAndID ... ta podatek se dobi, ko se sproži klic ledger_process
        // };
        //
        // console.log('dpkiGetOracleBlockRequest');
        // console.log(dpkiGetOracleBlockRequest);
        // const response2 = await this._apiService.dpki_getOracleBlock(dpkiGetOracleBlockRequest);
        //
        // console.log('RESPONSE 2');
        // console.log(response2);

        // const dpkiGetPublishInfosByAccountAndTypeRequest: IDpkiGetPublishInfosByAccountAndTypeRequest = {
        //     account: 'qlc_34gmbj5397z5j5kta5h1a58s5ucqrjux6msthzmwunzuaopuoje7qknysxtd', // VERIFIER ACCOUNT ID
        //     // account: 'qlc_34gmbj5397z5j5kta5h1a58s5ucqrjux6msthzmwunzuaopuoje7qknysxtd',
        //     type: socialType, // TYPE EMAIL
        // };
        //
        //
        //
        // console.log('dpkiGetPublishInfosByAccountAndTypeRequest');
        // console.log(dpkiGetPublishInfosByAccountAndTypeRequest);
        // const response2 = await this._apiService.dpki_getPublishInfosByAccountAndType(dpkiGetPublishInfosByAccountAndTypeRequest);
        //
        // console.log('RESPONSE 2');
        // console.log(response2);


        // const blockHashOracle = await this._apiService.ledger_blockHash(response2.result);
        // const signedOracle = nacl.sign.detached(this._utilService.hex.toUint8(blockHashOracle.result), accountKeyPair.secretKey);
        //
        // response2.result.signature = this._utilService.hex.fromUint8(signed);

        // console.log('RESPONSE 2 UPDATED');
        // console.log(response2);
        // // const ledgerProcessResponse = await this._apiService.ledger_process(publishBlock.result.block); // FOR PUBLICH BLOCK
        // const ledgerProcessResponse = await this._apiService.ledger_process(response2.result); // FOR PUBLICH BLOCK ORACLE
        //
        // console.log(ledgerProcessResponse);
        // if (ledgerProcessResponse.result) {
        //     this._libsodiumService.generateKeyPairs();
        //
        //     return true;
        // }

        // console.log(accountKeyPair.publicKey);

        return true;
        // return false;
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
                const account = this.getAccount();

                account.social = {
                    email: {
                        validated: false,
                        id,
                        code
                    }
                };

                this.saveAccount(account);

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
                const account = this.getAccount();

                if (account.social.email.code === code) {
                    account.social.email.validated = true;

                    this.saveAccount(account);

                    await this.updateChain(socialType);

                    return true;
                }

                return false;
        }
    }
}

