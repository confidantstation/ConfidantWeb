import { Injectable } from '@angular/core';
import * as Libsodium from 'libsodium-wrappers';
import * as concatTypedArray from 'concat-typed-array';

@Injectable({
    providedIn: 'root'
})
export class LibsodiumService {
    private _libsodium: Libsodium;
    private _nonceBytes: number;
    private _key: string;
    private _nonce: string;

    /**
     * @constructor
     */
    constructor() {
        this._init();
    }

    /**
     * @method _init
     */
    async _init(): Promise<void> {
        await Libsodium.ready;
        this._libsodium = Libsodium;
        this._nonceBytes = this._libsodium.crypto_aead_xchacha20poly1305_ietf_NPUBBYTES;

        const keyPair = this._libsodium.crypto_sign_keypair();
        const secretKey = this._libsodium.crypto_sign_ed25519_sk_to_curve25519(keyPair.privateKey);
        const publicKey = this._libsodium.crypto_sign_ed25519_pk_to_curve25519(keyPair.publicKey);
        const tempKeyPair = this._libsodium.crypto_box_keypair();
        const nonce = this._libsodium.randombytes_buf(this._libsodium.crypto_secretbox_NONCEBYTES);
        this._key = this._libsodium.crypto_box_beforenm(publicKey, secretKey);
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
    private _btoa(buffer: Buffer): string {
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
}
