import { Component, OnInit } from '@angular/core';
import { AccountService } from '../../../services/account.service';
import { LibsodiumService } from '../../../services/libsodium.service';
import { IAccount } from '../../../interfaces/app.interface';

@Component({
    selector: 'app-account-create',
    templateUrl: './account-create.component.html',
    styleUrls: ['./account-create.component.scss']
})
export class AccountCreateComponent implements OnInit {
    account: IAccount;
    mnemonic: string;

    /**
     * @constructor
     * @param {AccountService} _accountService
     * @param {LibsodiumService} _libsodiumService
     */
    constructor(
        private _accountService: AccountService,
        private _libsodiumService: LibsodiumService
    ) {
    }

    /**
     * @method ngOnInit
     */
    ngOnInit(): void {
    }

    /**
     * @method createNewAccount
     */
    async createNewAccount(): Promise<void> {
        await this._accountService.create();
        await this._accountService.updateChain();

        // this.account = await this._accountService.create();
        // this.mnemonic = bip39.entropyToMnemonic(this.account.seed);

        // const message = 'Confidant';
        // console.log('message: ', message);
        // const encrypted = this._libsodiumService.encrypt(message);
        // console.log('encrypted: ', encrypted);
        // try {
        //     const decrypted= this._libsodiumService.decrypt(encrypted);
        //     console.log('decrypted: ', decrypted);
        // } catch (e) {
        //     console.error(e);
        // }
    }
}
