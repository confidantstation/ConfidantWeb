import { Component } from '@angular/core';
import { LibsodiumService } from '../../services/libsodium.service';

@Component({
    selector: 'app-chat',
    templateUrl: './chat.component.html',
    styleUrls: ['./chat.component.scss']
})
export class ChatComponent {
    message: string;
    messageEncrypted: string;
    messageEncryptedAes128: string;
    messageEncryptedEasy: string;

    encryptedMessage: string;
    encryptedMessageAes128: string;
    encryptedMessageEasy: string;

    decryptedMessage: string;
    decryptedMessageAes128: string;
    decryptedMessageEasy: string;

    /**
     * @constructor
     * @param {LibsodiumService} _libsodiumService
     */
    constructor(
        private _libsodiumService: LibsodiumService
    ) {
    }

    /**
     * @method encrypt
     */
    encrypt(): void {
        this.messageEncrypted = this._libsodiumService.encrypt(this.message);
        this.messageEncryptedAes128 = this._libsodiumService.encryptAes128(this.message);
        this.messageEncryptedEasy = this._libsodiumService.encryptEasy(this.message);
    }

    /**
     * @method decrypt
     * @param {string} algorithm
     */
    decrypt(algorithm: string = 'aes128'): void {
        switch (algorithm) {
            case 'crypto_aead_xchacha20poly1305_ietf_decrypt':
                this.decryptedMessage = this._libsodiumService.decrypt(this.encryptedMessage);
                break;
            case 'crypto_secretbox_open_easy':
                this.decryptedMessageEasy = this._libsodiumService.decryptEasy(this.encryptedMessageEasy);
                break;
            default:
                this.decryptedMessageAes128 = this._libsodiumService.decryptAes128(this.encryptedMessageAes128);
                break;
        }
    }
}
