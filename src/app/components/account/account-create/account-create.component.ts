import { Component, OnInit } from '@angular/core';
import { AccountService, IAccount } from '../../../services/account.service';
import * as bip39 from 'bip39';

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
   * @method createNewAccount
   */
  createNewAccount(): void {
    this.account = this._accountService.create();
    this.mnemonic = bip39.entropyToMnemonic(this.account.seed);
  }
}
