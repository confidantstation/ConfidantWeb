import { Component, OnInit } from '@angular/core';
import { AccountService } from '../../services/account.service';

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
    accountExist: boolean = false;

    /**
     * @constructor
     * @param {AccountService} _accountService
     */
    constructor(private _accountService: AccountService) {
    }

    /**
     * @method ngOnInit
     */
    ngOnInit() {
        const account = this._accountService.getAccount();

        this.accountExist = !!account;
    }

    /**
     * @method deleteAccount
     */
    deleteAccount() {
        this._accountService.deleteAccount();
        this.accountExist = !this.accountExist;
    }
}
