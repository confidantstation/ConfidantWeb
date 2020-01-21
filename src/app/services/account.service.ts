import { Injectable } from '@angular/core';
import { UtilService } from './util.service';
import { ApiService } from './api.service';
import { AppSettingsService } from './app-settings.service';
import { WalletStoreEnum } from '../enums/wallet-store.enum';
import { AccountTypeEnum } from '../enums/account-type.enum';

export interface IWallet {
  id: string;
  secret?: any;
  keyPair?: any;
  index: number;
}

export interface IAccount {
  type: AccountTypeEnum;
  seedBytes?: any;
  seed?: string | null;
  wallets?: IWallet[];
  walletsIndex?: number;
}

@Injectable({
  providedIn: 'root'
})
export class AccountService {
  storeKey = `qlc-confidant`;

  account: IAccount = {
    type: AccountTypeEnum.SEED,
    seedBytes: null,
    seed: '',
    wallets: [],
    walletsIndex: 0
  };

  /**
   * @constructor
   * @param {UtilService} _utilService
   * @param {ApiService} _apiService
   * @param {AppSettingsService} _appSettingsService
   */
  constructor(
    private _utilService: UtilService,
    private _apiService: ApiService,
    private _appSettingsService: AppSettingsService
  ) {
  }

  /**
   * @private
   * @method addAccountWallet
   * @param {number|null} walletIndex
   * @returns {IWallet}
   */
  private _addAccountWallet(walletIndex: number | null = null): IWallet {
    if (walletIndex === null) {
      walletIndex = this.account.walletsIndex;

      // Make sure the index is not being used (ie. if you delete acct 3/5, then press add twice, it goes 3, 6, 7)
      while (this.account.wallets.find((obj: IWallet) => obj.index === walletIndex)) {
        walletIndex++;
      }

      try {
        let nextIndex = walletIndex + 1;
        while (this.account.wallets.find(a => a.index === nextIndex)) {
          nextIndex++;
        }
        this.account.walletsIndex = nextIndex;
      } catch (error) {
      }
    }

    let wallet: IWallet | null;

    if (this.account.type === 'privateKey') {
      throw new Error(`Cannot add another account in private key mode`);
    } else if (this.account.type === 'seed') {
      wallet = this._createWallet(walletIndex);
    }

    this.account.wallets.push(wallet);
    this.account.walletsIndex = this.account.wallets.length;

    this._saveWalletExport();

    return wallet;
  }

  /**
   * @private
   * @method _createWallet
   * @returns {IWallet}
   */
  private _createWallet(index): IWallet {
    const { walletBytes,  walletKeyPair, walletAddress } = this._getWalletData(index);

    return {
      id: walletAddress,
      secret: walletBytes,
      keyPair: walletKeyPair,
      index
    };
  }

  /**
   * @private
   * @method _generateWalletExport
   * @returns {IAccount}
   */
  private _generateWalletExport(): IAccount {
    const account: IAccount = {
      type: this.account.type,
      wallets: this.account.wallets.map((wallet: IWallet) => ({ id: wallet.id, index: wallet.index })),
      walletsIndex: this.account.walletsIndex
    };

    if (this.account.type === AccountTypeEnum.SEED) {
      account.seed = this.account.seed;
    }

    return account;
  }

  /**
   * @private
   * @method _getWalletData
   * @param {number} index
   * @returns
   */
  private _getWalletData(index: number): any {
    const walletBytes = this._utilService.wallet.generateWalletSecretKeyBytes(this.account.seedBytes, index);
    const walletKeyPair = this._utilService.wallet.generateWalletKeyPair(walletBytes);
    const walletAddress = this._utilService.wallet.getPublicWalletId(walletKeyPair.publicKey);

    return { walletBytes, walletKeyPair, walletAddress };
  }

  /**
   * @private
   * @method _resetAccount
   */
  private _resetAccount(): void {
    this.account.type = AccountTypeEnum.SEED;
    this.account.seed = '';
    this.account.seedBytes = null;
    this.account.wallets = [];
    this.account.walletsIndex = 0;
  }

  /**
   * @private
   * @method _saveWalletExport
   */
  private _saveWalletExport(): void {
    const exportData = this._generateWalletExport();

    switch (this._appSettingsService.appSetting.walletStore) {
      case WalletStoreEnum.NONE:
        this.removeWalletData();
        break;
      default:
      case WalletStoreEnum.LOCAL_STORAGE:
        localStorage.setItem(this.storeKey, JSON.stringify(exportData));
        break;
    }
  }

  /**
   * @method loadAccountsFromIndex
   * @returns Promise<IAccount>
   */
  async create(): Promise<IAccount> {
    this._resetAccount();

    const seedBytes = this._utilService.wallet.generateSeedBytes();
    this.account.seedBytes = seedBytes;
    this.account.seed = this._utilService.hex.fromUint8(seedBytes);

    // const account = await this._apiService.createAccount(this.account.seed);

    this._addAccountWallet();

    return this.account;
  }

  /**
   * @method createFromSeed
   * @returns {IAccount}
   */
  createFromSeed(seed: string, emptyAccountBuffer: number = 10): IAccount {
    this._resetAccount();

    this.account.seed = seed;
    this.account.seedBytes = this._utilService.hex.toUint8(seed);

    let emptyTicker = 0;
    let greatestUsedIndex = 0;
    const usedIndices = [];
    const batchSize = emptyAccountBuffer + 1;

    for (let batch = 0; emptyTicker < emptyAccountBuffer; batch++) {
      const batchWallets = {};

      for (let i = 0; i < batchSize; i++) {
        const index = batch * batchSize + i;
        const { walletKeyPair, walletAddress } = this._getWalletData(index);

        batchWallets[walletAddress] = {
          publicKey: this._utilService.uint8.toHex(walletKeyPair.publicKey).toUpperCase(),
          used: false,
          index
        };
      }

      Object.keys(batchWallets).map(walletId => {
        const wallet = batchWallets[walletId];

        if (wallet.used) {
          usedIndices.push(wallet.index);

          if (wallet.index > greatestUsedIndex) {
            greatestUsedIndex = wallet.index;
            emptyTicker = 0;
          }
        } else {
          if (wallet.index > greatestUsedIndex) {
            emptyTicker++;
          }
        }
      });
    }

    if (usedIndices.length > 0) {
      for (let i = 0; i < usedIndices.length; i++) {
        this._addAccountWallet(usedIndices[i]);
      }
    } else {
      this._addAccountWallet();
    }

    return this.account;
  }

  /**
   * @method removeWalletData
   */
  removeWalletData(): void {
    localStorage.removeItem(this.storeKey);
  }
}
