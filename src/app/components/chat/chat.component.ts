import { Component } from '@angular/core';
import { AccountService } from '../../services/account.service';

@Component({
    selector: 'app-chat',
    templateUrl: './chat.component.html',
    styleUrls: ['./chat.component.scss']
})
export class ChatComponent {
    message: string;
    encryptedMessage: string;
    decryptedMessage: string;

    messageFriend: string;
    encryptedMessageFriend: string;
    decryptedMessageFriend: string;

    /**
     * @constructor
     * @param {AccountService} _accountService
     */
    constructor(
        private _accountService: AccountService
    ) {
    }

    /**
     * @method encrypt
     */
    encrypt(): void {
        this.encryptedMessage = this._accountService.encrypt(this.message);
    }

    /**
     * @method encryptFriend
     */
    encryptFriend(): void {
        this.encryptedMessageFriend = this._accountService.encryptFriend(this.messageFriend);
    }

    /**
     * @method decrypt
     */
    decrypt(): void {
        try {
            this.decryptedMessage = this._accountService.decrypt(this.encryptedMessageFriend);
        }
        catch (error) {
            console.log('error');
            console.log(error.message);
        }
    }

    /**
     * @method decryptFriend
     */
    decryptFriend(): void {
        this.decryptedMessageFriend = this._accountService.decryptFriend(this.encryptedMessage);
    }
}
