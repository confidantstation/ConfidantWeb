import { Injectable } from '@angular/core';
import { httpProvider } from 'qlc.js/provider/HTTP';
import Client from 'qlc.js/client';
import { environment } from '../../environments/environment';
import { methods } from 'qlc.js/common';

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

        console.log(methods);
    }

  /**
   * @method createAccount
   * @param {string} seed
   * @returns Promise<{ result: any; error?: any }>
   */
  async createAccount(seed: string): Promise<{ result: any; error?: any }> {
        try {
            return await this._client.request(methods.account.accountCreate, seed);
        } catch (error) {
            return error;
        }
    }
}
