import { Injectable } from '@angular/core';
import { WalletStoreEnum } from '../enums/wallet-store.enum';

interface IAppSetting {
  walletStore: WalletStoreEnum;
}

@Injectable({
  providedIn: 'root'
})
export class AppSettingsService {
  appSetting: IAppSetting = {
    walletStore: WalletStoreEnum.LOCAL_STORAGE,
  };
}
