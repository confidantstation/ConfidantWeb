import { Injectable } from '@angular/core';
import { httpProvider } from 'qlc.js/provider/HTTP';
import Client from 'qlc.js/client';
import { environment } from '../../environments/environment';
import {
    IAccountCreate,
    IAccountNewAccounts, IDpkiGetOracleBlockRequest, IDpkiGetOracleInfosByTypeAndIdRequest,
    IDpkiGetPublishBlockRequest,
    IDpkiGetPublishBlockResponse, IDpkiGetPublishInfosByAccountAndTypeRequest
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
        this._httpProvider = new httpProvider(environment.rpcUrl[environment.qlcChainNetwork]);
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
     * @param {IDpkiGetPublishBlockRequest} dpkiGetPublishBlockRequest
     * @returns Promise<{ result: IDpkiGetPublishBlockResponse; error?: any }>
     */
    async dpki_getPublishBlock(dpkiGetPublishBlockRequest: IDpkiGetPublishBlockRequest): Promise<{ result: IDpkiGetPublishBlockResponse; error?: any }> {
        try {
            return await this._client.request(this.dpki_getPublishBlock.name, dpkiGetPublishBlockRequest);
        } catch (error) {
            console.log(`${this.dpki_getPublishBlock.name} error`);
            console.log(error);
            return error;
        }
    }

    /**
     * @method dpki_getPubKeyByTypeAndID
     * @param {any} params
     * @returns Promise<{ result: string; error?: any }>
     */
    async dpki_getPubKeyByTypeAndID(params: any): Promise<{ result: any; error?: any }> {
        try {
            return await this._client.request(this.dpki_getPubKeyByTypeAndID.name, params.type, params.id);
        } catch (error) {
            console.log(`${this.dpki_getPubKeyByTypeAndID.name} error`);
            console.log(error);
            return error;
        }
    }

    /**
     * @method dpki_getPubKeyByTypeAndID
     * @param {IDpkiGetPublishInfosByAccountAndTypeRequest} dpkiGetPublishInfosByAccountAndTypeRequest
     * @returns Promise<{ result: string; error?: any }>
     */
    async dpki_getPublishInfosByAccountAndType(dpkiGetPublishInfosByAccountAndTypeRequest: IDpkiGetPublishInfosByAccountAndTypeRequest): Promise<{ result: any; error?: any }> {
        try {
            return await this._client.request(this.dpki_getPublishInfosByAccountAndType.name, dpkiGetPublishInfosByAccountAndTypeRequest.account, dpkiGetPublishInfosByAccountAndTypeRequest.type);
        } catch (error) {
            console.log(`${this.dpki_getPublishInfosByAccountAndType.name} error`);
            console.log(error);
            return error;
        }
    }

    /**
     * @method dpki_getOracleBlock
     * @param {IDpkiGetOracleBlockRequest} dpkiGetOracleBlockRequest
     * @returns Promise<{ result: any; error?: any }>
     */
    async dpki_getOracleBlock(dpkiGetOracleBlockRequest: IDpkiGetOracleBlockRequest): Promise<{ result: any; error?: any }> {
        try {
            return await this._client.request(this.dpki_getOracleBlock.name, dpkiGetOracleBlockRequest);
        } catch (error) {
            console.log(`${this.dpki_getOracleBlock.name} error`);
            console.log(error);
            return error;
        }
    }

    /**
     * @method dpki_getOracleInfosByTypeAndID
     * @param {IDpkiGetOracleInfosByTypeAndIdRequest} dpkiGetOracleInfosByTypeAndIdRequest
     * @returns Promise<{ result: any; error?: any }>
     */
    async dpki_getOracleInfosByTypeAndID(dpkiGetOracleInfosByTypeAndIdRequest: IDpkiGetOracleInfosByTypeAndIdRequest): Promise<{ result: any; error?: any }> {
        try {
            return await this._client.request(this.dpki_getOracleInfosByTypeAndID.name, dpkiGetOracleInfosByTypeAndIdRequest.type, dpkiGetOracleInfosByTypeAndIdRequest.id);
        } catch (error) {
            console.log(`${this.dpki_getOracleInfosByTypeAndID.name} error`);
            console.log(error);
            return error;
        }
    }
}
