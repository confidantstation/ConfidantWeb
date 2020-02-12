import { Component, OnInit } from '@angular/core';
import { AccountService } from '../../../services/account.service';
import { SocialTypeEnum } from '../../../enums/social-type.enum';

@Component({
    selector: 'app-email',
    templateUrl: './email.component.html',
    styleUrls: ['./email.component.scss']
})
export class EmailComponent implements OnInit {
    email: string;
    code: string;
    generatedCode: number;
    verifyStatus: boolean;

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
        this.verifyStatus = await this._accountService.socialVerify(SocialTypeEnum.EMAIL, Number.parseInt(this.code));
    }
}
