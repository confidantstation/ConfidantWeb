import { Injectable } from '@angular/core';
import * as Libsodium from 'libsodium-wrappers';
import * as concatTypedArray from 'concat-typed-array';
import * as crypto from 'crypto';

@Injectable({
    providedIn: 'root'
})
export class LibsodiumService {
    private _libsodium: Libsodium;
    private _nonceBytes: number;
    private _key: string;
    private _keyAlice: string;
    private _keyBob: string;
    private algorithm: string = 'aes-128-ctr';
    private _nonce: string;

    /**
     * @constructor
     */
    constructor() {
        this._init().catch(console.log);
    }

    /**
     * @method _init
     */
    async _init(): Promise<void> {
        await Libsodium.ready;
        this._libsodium = Libsodium;
        this._nonceBytes = this._libsodium.crypto_aead_xchacha20poly1305_ietf_NPUBBYTES;

        const keyPair = this._libsodium.crypto_sign_keypair();
        const keyPairAlice = this._libsodium.crypto_sign_keypair();
        const keyPairBob = this._libsodium.crypto_sign_keypair();

        const secretKey = this._libsodium.crypto_sign_ed25519_sk_to_curve25519(keyPair.privateKey);
        const publicKey = this._libsodium.crypto_sign_ed25519_pk_to_curve25519(keyPair.publicKey);

        const secretKeyAlice = this._libsodium.crypto_sign_ed25519_sk_to_curve25519(keyPairAlice.privateKey);
        const publicKeyAlice = this._libsodium.crypto_sign_ed25519_pk_to_curve25519(keyPairAlice.publicKey);

        const secretKeyBob = this._libsodium.crypto_sign_ed25519_sk_to_curve25519(keyPairBob.privateKey);
        const publicKeyBob = this._libsodium.crypto_sign_ed25519_pk_to_curve25519(keyPairBob.publicKey);

        this._key = this._libsodium.crypto_box_beforenm(publicKey, secretKey);
        this._keyAlice = this._libsodium.crypto_box_beforenm(publicKeyBob, secretKeyAlice);
        this._keyBob = this._libsodium.crypto_box_beforenm(publicKeyAlice, secretKeyBob);

        const keyPairAliceTemp = this._libsodium.crypto_box_keypair();

        this._keyAlice = this._libsodium.crypto_box_beforenm(publicKeyBob, keyPairAliceTemp.privateKey);
        this._keyBob = this._libsodium.crypto_box_beforenm(keyPairAliceTemp.publicKey, secretKeyBob);
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
     * @private
     * @method _encryptAndPrependNonce
     * @param {string} message
     * @returns {Uint8Array}
     */
    private _encryptAndPrependNonce(message: string): Uint8Array {
        const nonce = this._libsodium.randombytes_buf(this._nonceBytes);
        this._nonce = nonce.toString();

        const encrypted = this._libsodium.crypto_aead_xchacha20poly1305_ietf_encrypt(message, null, nonce, nonce, this._key);

        return concatTypedArray(Uint8Array, nonce, encrypted);
    }

    /**
     * @private
     * @method _decryptAfterExtractingNonce
     * @param {Uint8Array} nonceAndCiphertext
     * @returns {string}
     */
    private _decryptAfterExtractingNonce(nonceAndCiphertext: Uint8Array): string {
        const nonce = nonceAndCiphertext.slice(0, this._nonceBytes);

        if (this._nonce !== nonce.toString()) {
            console.error('nonce does not match! Original nonce was ', this._nonce);
        }

        const ciphertext = nonceAndCiphertext.slice(this._nonceBytes);

        return this._libsodium.crypto_aead_xchacha20poly1305_ietf_decrypt(nonce, ciphertext, null, nonce, this._key, 'text');
    }

    /**
     * @method encrypt
     * @param {string} message
     * @returns {string}
     */
    encrypt(message: string): string {
        return this._btoa(this._encryptAndPrependNonce(message));
    }

    /**
     * @method decrypt
     * @param {string} nonceAndCiphertext
     * @returns {string}
     */
    decrypt(nonceAndCiphertext: string): string {
        return this._decryptAfterExtractingNonce(this._atob(nonceAndCiphertext));
    }

    /**
     * @method encryptEasy
     * @param {string} message
     * @returns {string}
     */
    encryptEasy(message: string): string {
        const nonce = this._libsodium.randombytes_buf(this._libsodium.crypto_secretbox_NONCEBYTES);
        const encrypted = this._libsodium.crypto_secretbox_easy(message, nonce, this._key);

        return this._btoa(concatTypedArray(Uint8Array, nonce, encrypted));
    }

    /**
     * @method decrypt
     * @param {string} nonceAndCiphertext
     * @returns {string}
     */
    decryptEasy(nonceAndCiphertext: string): string {
        const nonceAndCiphertextNew = this._atob(nonceAndCiphertext);

        if (nonceAndCiphertextNew.length < this._libsodium.crypto_secretbox_NONCEBYTES + this._libsodium.crypto_secretbox_MACBYTES) {
            throw 'Short message';
        }

        const nonce = nonceAndCiphertextNew.slice(0, this._libsodium.crypto_secretbox_NONCEBYTES);
        const ciphertext = nonceAndCiphertextNew.slice(this._libsodium.crypto_secretbox_NONCEBYTES);

        return this._libsodium.to_string(this._libsodium.crypto_secretbox_open_easy(ciphertext, nonce, this._key));
    }

    /**
     * @method encryptAes128
     * @param {string} message
     * @returns {string}
     */
    encryptAes128(message: string): string {
        const cipher = crypto.createCipher(this.algorithm, this._keyAlice);
        let encrypted = cipher.update(message, 'utf8', 'hex');

        return encrypted += cipher.final('hex');
    }

    /**
     * @method decryptAes128
     * @param {string} encrypted
     * @returns {string}
     */
    decryptAes128(encrypted: string): string {
        const decipher = crypto.createDecipher(this.algorithm, this._keyBob);
        let decrypted = decipher.update(encrypted, 'hex', 'utf8');

        return decrypted += decipher.final('utf8');
    }
}
