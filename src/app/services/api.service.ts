import { Injectable } from '@angular/core';
import { httpProvider } from 'qlc.js/provider/HTTP';
import Client from 'qlc.js/client';
import { environment } from '../../environments/environment';
import {
    IAccountCreate,
    IAccountNewAccounts,
    IDpkiGetPublishBlockRequest,
    IDpkiGetPublishBlockResponse
} from '../interfaces/api.interface';

@Injectable({
    providedIn: 'root'
})
export class ApiService {
    private _httpProvider: httpProvider;
    private _client: Client;

    /**
     * @constructor
     */
    constructor() {
        // this._httpProvider = new httpProvider(environment.rpcUrl[environment.qlcChainNetwork]);
        this._httpProvider = new httpProvider(environment.rpcUrl['test']);
        this._client = new Client(this._httpProvider, () => {
        });
    }

    /**
     * @method account_create
     * @param {string} seed
     * @returns Promise<{ result: IAccountCreate; error?: any }>
     */
    async account_create(seed: string): Promise<{ result: IAccountCreate; error?: any }> {
        try {
            return await this._client.request(this.account_create.name, seed);
        } catch (error) {
            console.log(`${this.account_create.name} error`);
            console.log(error);
            return error;
        }
    }

    /**
     * @method account_newAccounts
     * @param {number} numberOfAccounts
     * @returns Promise<{ result: IAccountNewAccounts[]; error?: any }>
     */
    async account_newAccounts(numberOfAccounts: number = 1): Promise<{ result: IAccountNewAccounts[]; error?: any }> {
        try {
            return await this._client.request(this.account_newAccounts.name, numberOfAccounts);
        } catch (error) {
            console.log(`${this.account_newAccounts.name} error`);
            console.log(error);
            return error;
        }
    }

    /**
     * @method account_forPublicKey
     * @param {string} publicKey
     * @returns Promise<{ result: string; error?: any }>
     */
    async account_forPublicKey(publicKey: string): Promise<{ result: string; error?: any }> {
        try {
            return await this._client.request(this.account_forPublicKey.name, publicKey);
        } catch (error) {
            console.log(`${this.account_forPublicKey.name} error`);
            console.log(error);
            return error;
        }
    }

    /**
     * @method dpki_getPubKeyByTypeAndID
     * @param {any} dpkiGetPubKeyByTypeAndID
     * @returns Promise<{ result: string; error?: any }>
     */
    async dpki_getPubKeyByTypeAndID(dpkiGetPubKeyByTypeAndID: any): Promise<{ result: any; error?: any }> {
        try {
            console.log(dpkiGetPubKeyByTypeAndID);
            return await this._client.request(this.dpki_getPubKeyByTypeAndID.name, 'email', 'dtacer@gmail.com');
            // return await this._client.request(this.dpki_getPubKeyByTypeAndID.name, dpkiGetPubKeyByTypeAndID);
        } catch (error) {
            console.log(`${this.dpki_getPubKeyByTypeAndID.name} error`);
            console.log(error);
            return error;
        }
    }

    /**
     * @method ledger_blockHash
     * @param block
     * @returns Promise<{ result: string; error?: any }>
     */
    async ledger_blockHash(block: any): Promise<{ result: string; error?: any }> {
        try {
            return await this._client.request(this.ledger_blockHash.name, block);
        } catch (error) {
            console.log(`${this.ledger_blockHash.name} error`);
            console.log(error);
            return error;
        }
    }

    /**
     * @method ledger_process
     * @param block
     * @returns Promise<{ result: string; error?: any }>
     */
    async ledger_process(block: any): Promise<{ result: string; error?: any }> {
        console.log('ledger_process');
        console.log(block);
        try {
            return await this._client.request(this.ledger_process.name, block);
        } catch (error) {
            console.log(`${this.ledger_process.name} error`);
            console.log(error);
            return error;
        }
    }

    /**
     * @method dpki_getAllVerifiers
     * @returns Promise<{ result: any; error?: any }>
     */
    async dpki_getAllVerifiers(): Promise<{ result: any; error?: any }> {
        try {
            return await this._client.request(this.dpki_getAllVerifiers.name);
        } catch (error) {
            console.log(`${this.dpki_getAllVerifiers.name} error`);
            console.log(error);
            return error;
        }
    }

    /**
     * @method dpki_getPublishBlock
     * @param {IDpkiGetPublishBlockRequest} dpkiGetPublishBlock
     * @returns Promise<{ result: IDpkiGetPublishBlockResponse; error?: any }>
     */
    async dpki_getPublishBlock(dpkiGetPublishBlock: IDpkiGetPublishBlockRequest): Promise<{ result: IDpkiGetPublishBlockResponse; error?: any }> {
        try {
            console.log([dpkiGetPublishBlock]);
            return await this._client.request(this.dpki_getPublishBlock.name, dpkiGetPublishBlock);
        } catch (error) {
            console.log(`${this.dpki_getPublishBlock.name} error`);
            console.log(error);
            return error;
        }
    }
}
