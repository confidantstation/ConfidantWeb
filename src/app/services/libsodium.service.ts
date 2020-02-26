import { Injectable } from '@angular/core';
import * as Libsodium from 'libsodium-wrappers';
import * as crypto from 'crypto';
import { IAccount } from '../interfaces/app.interface';
import { environment } from '../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class LibsodiumService {
    private _account: IAccount;
    private _libsodium: Libsodium;
    private _keyEncrypt: string;
    private _keyDecrypt: string;
    private _keyEncryptFriend: string;
    private _keyDecryptFriend: string;
    private readonly _algorithm: string;

    /**
     * @constructor
     */
    constructor() {
        this._algorithm = environment.encryption.algorithm;
        this._init().catch(console.log);
    }

    /**
     * @method _init
     */
    async _init(): Promise<void> {
        await Libsodium.ready;
        this._libsodium = Libsodium;
    }

    /**
     * @private
     * @method _atob
     * @param {string} ascii
     * @returns {Uint8Array}
     */
    private _atob(ascii: string): Uint8Array {
        return Uint8Array.from(atob(ascii), c => c.charCodeAt(0));
    }

    /**
     * @private
     * @method _btoa
     * @param buffer
     * @returns {string}
     */
    private _btoa(buffer: any): string {
        const binary = [];
        const bytes = new Uint8Array(buffer);

        for (let i = 0, byteLength = bytes.byteLength; i < byteLength; i++) {
            binary.push(String.fromCharCode(bytes[i]));
        }

        return btoa(binary.join(''));
    }

    /**
     * @method _generateEncryptKey
     */
    private _generateEncryptKey(): void {
        this._keyEncrypt = this._libsodium.crypto_box_beforenm(this._atob(this._account.encryption.friend.keyPair.publicKey), this._atob(this._account.encryption.keyPairTemp.privateKey));
    }

    /**
     * @method _generateEncryptKeyFriend
     */
    private _generateEncryptKeyFriend(): void {
        this._keyEncryptFriend = this._libsodium.crypto_box_beforenm(this._atob(this._account.encryption.keyPair.publicKey), this._atob(this._account.encryption.friend.keyPairTemp.privateKey));
    }

    /**
     * @method _generateDecryptKey
     * @param {string} publicKeyTemp
     */
    private _generateDecryptKey(publicKeyTemp: string): void {
        this._keyDecrypt = this._libsodium.crypto_box_beforenm(this._atob(publicKeyTemp), this._atob(this._account.encryption.keyPair.privateKey));
    }

    /**
     * @method _generateDecryptKeyFriend
     * @param {string} publicKeyTemp
     */
    private _generateDecryptKeyFriend(publicKeyTemp: string): void {
        this._keyDecryptFriend = this._libsodium.crypto_box_beforenm(this._atob(publicKeyTemp), this._atob(this._account.encryption.friend.keyPair.privateKey));
    }

    /**
     * @method setAccount
     * @param {IAccount} account
     */
    setAccount(account: IAccount): void {
        this._account = account;
    }

    /**
     * @method generateKeyPairs
     * @returns any
     */
    generateEncryption(): any {
        const keyPair = this._libsodium.crypto_sign_keypair();
        const keyPairFriend = this._libsodium.crypto_sign_keypair();

        const publicKey = this._libsodium.crypto_sign_ed25519_pk_to_curve25519(keyPair.publicKey);
        const privateKey = this._libsodium.crypto_sign_ed25519_sk_to_curve25519(keyPair.privateKey);

        const publicKeyFriend = this._libsodium.crypto_sign_ed25519_pk_to_curve25519(keyPairFriend.publicKey);
        const privateKeyFriend = this._libsodium.crypto_sign_ed25519_sk_to_curve25519(keyPairFriend.privateKey);

        const keyPairTemp = this._libsodium.crypto_box_keypair();
        const keyPairTempFriend = this._libsodium.crypto_box_keypair();

        return {
            keyPair: {
                publicKey: this._btoa(publicKey),
                privateKey: this._btoa(privateKey)
            },
            keyPairTemp: {
                publicKey: this._btoa(keyPairTemp.publicKey),
                privateKey: this._btoa(keyPairTemp.privateKey)
            },
            friend: {
                keyPair: {
                    publicKey: this._btoa(publicKeyFriend),
                    privateKey: this._btoa(privateKeyFriend)
                },
                keyPairTemp: {
                    publicKey: this._btoa(keyPairTempFriend.publicKey),
                    privateKey: this._btoa(keyPairTempFriend.privateKey)
                }
            }
        };
    }

    /**
     * @method encrypt
     * @param {string} message
     * @returns {object}
     */
    encrypt(message: string): string {
        this._keyEncrypt || this._generateEncryptKey();

        const cipher = crypto.createCipher(this._algorithm, this._keyEncrypt);
        let encryptedData = cipher.update(message, 'utf8', 'hex');

        encryptedData += cipher.final('hex');

        const nonceBytes = this._libsodium.crypto_aead_xchacha20poly1305_ietf_NPUBBYTES;
        const nonce = this._libsodium.randombytes_buf(nonceBytes);

        return `${environment.encryption.fixedKeyword}01${this._account.encryption.keyPairTemp.publicKey}00${this._btoa(nonce)}${encryptedData}`;
    }

    /**
     * @method encrypt
     * @param {string} message
     * @returns {object}
     */
    encryptFriend(message: string): string {
        this._keyEncryptFriend || this._generateEncryptKeyFriend();

        const cipher = crypto.createCipher(this._algorithm, this._keyEncryptFriend);
        let encryptedData = cipher.update(message, 'utf8', 'hex');

        encryptedData += cipher.final('hex');

        const nonceBytes = this._libsodium.crypto_aead_xchacha20poly1305_ietf_NPUBBYTES;
        const nonce = this._libsodium.randombytes_buf(nonceBytes);

        return `${environment.encryption.fixedKeyword}01${this._account.encryption.friend.keyPairTemp.publicKey}00${this._btoa(nonce)}${encryptedData}`;
    }

    /**
     * @method decrypt
     * @param {string} encryptedMessage
     * @returns {string}
     */
    decrypt(encryptedMessage: string): string {
        if (!encryptedMessage.startsWith(environment.encryption.fixedKeyword)) {
            throw new Error('Wrong encrypted message');
        }

        if (!encryptedMessage.startsWith('01', 8)) {
            throw new Error('Wrong encrypted message');
        }

        if (!encryptedMessage.startsWith('00', 54)) {
            throw new Error('Wrong encrypted message');
        }

        const publicKeyTemp = encryptedMessage.substr(10, 44);
        const message = encryptedMessage.substr(88);

        this._generateDecryptKey(publicKeyTemp);

        const decipher = crypto.createDecipher(this._algorithm, this._keyDecrypt);
        let decrypted = decipher.update(message, 'hex', 'utf8');

        return decrypted += decipher.final('utf8');
    }

    /**
     * @method decryptAes128
     * @param {string} encryptedMessage
     * @returns {string}
     */
    decryptFriend(encryptedMessage: string): string {
        if (!encryptedMessage.startsWith(environment.encryption.fixedKeyword)) {
            throw new Error('Wrong encrypted message');
        }

        if (!encryptedMessage.startsWith('01', 8)) {
            throw new Error('Wrong encrypted message');
        }

        if (!encryptedMessage.startsWith('00', 54)) {
            throw new Error('Wrong encrypted message');
        }

        const publicKeyTemp = encryptedMessage.substr(10, 44);
        const message = encryptedMessage.substr(88);

        this._generateDecryptKeyFriend(publicKeyTemp);

        const decipher = crypto.createDecipher(this._algorithm, this._keyDecryptFriend);
        let decrypted = decipher.update(message, 'hex', 'utf8');

        return decrypted += decipher.final('utf8');
    }
}
