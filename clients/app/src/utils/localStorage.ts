import { Ed25519KeyIdentity } from '@dfinity/identity';
import { JsonnableDelegationChain } from '@dfinity/identity/lib/cjs/identity/delegation';

export interface AuthClientStorage {
  get(key: string): string | null;

  set(key: string, value: string): void;

  remove(key: string): void;
}

// type StorageDataType = 'identity' | 'wallet' | string;
// type StorageDataSubType = 'nns' | 'plug' | 'stoic' | 'me' | 'unknown' | string;

// type AuthLocalStorageOption = {
//   anchor: string;
//   type: StorageDataType;
//   subType: StorageDataSubType;
//   localStorage?: Storage;
// };

export interface RecoverableIdentity {
  delegationChain: JsonnableDelegationChain;
  originIdentity: string;
  key: Ed25519KeyIdentity;
  expiredTime?: number;
}

export enum LSKeyEnum {
  WALLET_NNS_DELEGATION = 'WALLET_NNS_DELEGATION',
  SEND_NFT_SUCCESS = '',
  USER_NAME = 'USER_NAME',
  LOGIN_TYPE = 'LOGIN_TYPE',
  AUTH_WALLET_DEFAULT = 'AUTH_WALLET_DEFAULT2',
  AUTH_DELEGATION_MODE = 'AUTH_DELEGATION_MODE',
  THEME = 'THEME',
  HIDDEN_BALANCE = 'HIDDEN_BALANCE',
  EXPLORER = 'EXPLORER',
  ASKING_AUTH = 'ASKING_AUTH',
  LOCAL_LANGUAGE = 'LOCAL_LANGUAGE',
  DAPPS_RECENTLY = 'DAPPS_RECENTLY',
  LOCAL_TOKENS_SORT = 'LOCAL_TOKENS_SORT',
  LOCAL_CUSTOM_TOKENS = 'LOCAL_CUSTOM_TOKENS',
  LOCAL_ENABLE_NETWORKS = 'LOCAL_ENABLE_NETWORKS',
  LOCAL_NETWORKS_SORT = 'LOCAL_NETWORKS_SORT',
  LOCAL_CUSTOM_NETWORKS = 'LOCAL_CUSTOM_NETWORKS',
  LOCAL_NFTS_SORT = 'LOCAL_NFTS_SORT',
  LOCAL_CUSTOM_NFTS = 'LOCAL_CUSTOM_NFTS',
  SAFE_DAPP = 'SAFE_DAPP',
  PROXY_EXPIRY = 'PROXY_EXPIRY',
  PRICES = 'PRICES',
  USER_CONFIG = 'USER_CONFIG',
  GAS_ESTIMATE = 'GAS_ESTIMATE',
  NETWORKS_CONFIG = 'NETWORKS_CONFIG',
  TOKENS_CONFIG = 'TOKENS_CONFIG',
  BLOCK_EXPLORERS = 'BLOCK_EXPLORERS',
}

export enum IndexDBEnum {
  VALID_WALLET_OPTION = 'VALID_WALLET_OPTION',
  WALLET_NNS_DELEGATION = 'WALLET_NNS_DELEGATION',
  WALLET_ME_DELEGATION = 'WALLET_ME_DELEGATION',
}

export class LocalStorage implements AuthClientStorage {
  private _var1;
  private _var2;
  constructor(var1?: string, var2?: string) {
    this._var1 = var1;
    this._var2 = var2;
  }

  public get(key: LSKeyEnum): string | null {
    return this._getLocalStorage().getItem(
      `${key}${this._var1 !== undefined ? `_${this._var1}` : ''}${this._var2 !== undefined ? `_${this._var2}` : ''}`,
    );
  }

  public set(key: LSKeyEnum, value: string): void {
    this._getLocalStorage().setItem(
      `${key}${this._var1 !== undefined ? `_${this._var1}` : ''}${this._var2 !== undefined ? `_${this._var2}` : ''}`,
      value,
    );
  }

  public getWithExpiry(key: LSKeyEnum) {
    const itemStr = this._getLocalStorage().getItem(
      `${key}${this._var1 !== undefined ? `_${this._var1}` : ''}${this._var2 !== undefined ? `_${this._var2}` : ''}`,
    );
    // if the item doesn't exist, return null
    if (!itemStr) {
      return null;
    }
    const item = JSON.parse(itemStr);
    const now = new Date();
    // compare the expiry time of the item with the current time
    if (now.getTime() > item.expiry) {
      // If the item is expired, delete the item from storage
      // and return null
      this._getLocalStorage().removeItem(
        `${key}${this._var1 !== undefined ? `_${this._var1}` : ''}${this._var2 !== undefined ? `_${this._var2}` : ''}`,
      );
      return null;
    }
    return item.value;
  }

  public setWithExpiry(key: LSKeyEnum, value: string, ttl: number) {
    const now = new Date();
    // `item` is an object which contains the original value
    // as well as the time when it's supposed to expire
    const item = {
      value: value,
      expiry: now.getTime() + ttl,
    };
    this._getLocalStorage().setItem(
      `${key}${this._var1 !== undefined ? `_${this._var1}` : ''}${this._var2 !== undefined ? `_${this._var2}` : ''}`,
      JSON.stringify(item),
    );
  }

  public remove(key: LSKeyEnum): void {
    this._getLocalStorage().removeItem(
      `${key}${this._var1 !== undefined ? `_${this._var1}` : ''}${this._var2 !== undefined ? `_${this._var2}` : ''}`,
    );
  }

  private _getLocalStorage() {
    const ls =
      typeof window === 'undefined'
        ? typeof global === 'undefined'
          // eslint-disable-next-line no-restricted-globals
          ? typeof self === 'undefined'
            ? undefined
            // eslint-disable-next-line no-restricted-globals
            : self.localStorage
          : global.localStorage
        : window.localStorage;

    if (!ls) {
      throw new Error('Could not find local storage.');
    }

    return ls;
  }
}
