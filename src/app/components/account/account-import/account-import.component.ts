import { Component, OnInit } from '@angular/core';
import { AccountService, IAccount } from '../../../services/account.service';
import { ImportOptionEnum } from '../../../enums/import-option.enum';
import * as bip39 from 'bip39';

@Component({
    selector: 'app-account-import',
    templateUrl: './account-import.component.html',
    styleUrls: ['./account-import.component.scss']
})
export class AccountImportComponent implements OnInit {
    account: IAccount;
    importOptionType: ImportOptionEnum = ImportOptionEnum.SEED;
    wif: string;

    /**
     * @constructor
     * @param {AccountService} _accountService
     */
    constructor(
        private _accountService: AccountService
    ) {
    }

    /**
     * @method ngOnInit
     */
    ngOnInit(): void {
    }

    /**
     * @method import
     */
    import(): void {
        if (!this.wif) {
            return;
        }

        this.wif = this.wif.trim();

        if (this.importOptionType === ImportOptionEnum.SEED) {
            if (this.wif.length !== 64) {
                return;
            }
        } else if (this.importOptionType === ImportOptionEnum.MNEMONIC) {
            if (this.wif.split(' ').length < 12) {
                return;
            }

            this.wif = bip39.mnemonicToEntropy(this.wif);

            if (!this.wif || this.wif.length !== 64) {
                return;
            }
        } else {

        }

        this.account = this._accountService.createFromSeed(this.wif);

        console.log(this.account);
    }
}
