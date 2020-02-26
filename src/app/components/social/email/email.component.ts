import { Component, OnInit } from '@angular/core';
import { AccountService } from '../../../services/account.service';
import { SocialTypeEnum } from '../../../enums/social-type.enum';

@Component({
    selector: 'app-email',
    templateUrl: './email.component.html',
    styleUrls: ['./email.component.scss']
})
export class EmailComponent implements OnInit {
    accounts: any[] = [];
    email: string = 'dtacer@gmail.com';
    emailAddress: string;
    code: string;
    generatedCode: number;
    verifyStatus: boolean = undefined;
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
     * @method sendEmail
     */
    sendEmail(): void {
        this.generatedCode = this._accountService.socialConnect(SocialTypeEnum.EMAIL, this.email);
    }

    /**
     * @method verifyCode
     */
    async verifyCode(): Promise<void> {
        this.inProgress = !this.inProgress;
        this.verifyStatus = await this._accountService.socialVerify(SocialTypeEnum.EMAIL, Number.parseInt(this.code));
        this.inProgress = !this.inProgress;
    }

    /**
     * @method getAccountByEmail
     */
    async getAccountByEmail(): Promise<void> {
        this.inProgress = !this.inProgress;
        this.accounts = await this._accountService.getAccountByTypeAndId(SocialTypeEnum.EMAIL, this.emailAddress);
        this.inProgress = !this.inProgress;

        console.log(this.accounts);
    }
}
