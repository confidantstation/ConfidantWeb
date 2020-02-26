import { Component, OnInit } from '@angular/core';
import { AccountService } from '../../../services/account.service';
import { ImportOptionEnum } from '../../../enums/import-option.enum';
import * as bip39 from 'bip39';
import { IAccount } from '../../../interfaces/app.interface';
import { Router } from '@angular/router';

@Component({
    selector: 'app-account-import',
    templateUrl: './account-import.component.html',
    styleUrls: ['./account-import.component.scss']
})
export class AccountImportComponent implements OnInit {
    account: IAccount;
    importOptionType: ImportOptionEnum = ImportOptionEnum.SEED;
    wif: string;
    inProgress: boolean;

    /**
     * @constructor
     * @param {AccountService} _accountService
     * @param {Router} _router
     */
    constructor(
        private _accountService: AccountService,
        private _router: Router
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
    async import(): Promise<boolean> {
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
        }

        this.inProgress = !this.inProgress;
        await this._accountService.createFromSeed(this.wif);

        return this._router.navigate(['/']);
    }
}
