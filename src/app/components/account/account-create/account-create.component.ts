import { Component, OnInit } from '@angular/core';
import { AccountService } from '../../../services/account.service';
import { IAccount } from '../../../interfaces/app.interface';

@Component({
    selector: 'app-account-create',
    templateUrl: './account-create.component.html',
    styleUrls: ['./account-create.component.scss']
})
export class AccountCreateComponent implements OnInit {
    account: IAccount;
    inProgress: boolean;

    /**
     * @constructor
     * @param {AccountService} _accountService
     */
    constructor(private _accountService: AccountService) {
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
        this.inProgress = !this.inProgress;
        this.account = await this._accountService.create();
        this.inProgress = !this.inProgress;
    }
}
