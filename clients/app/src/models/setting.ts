import { createModel } from '@rematch/core';
import { getTokenList, getNftList, queryChainBrowser, queryMultichainNetworkConfig, queryUserConfigure } from '../utils/http/api/api';
import { LocalStorage, LSKeyEnum } from '../utils/localStorage';
import { CollectionsType, UserToken } from '../utils/assets';
import type { RootModel } from '../store/models';
import { getGasEstimate, getSymbolPrices, inscribeFee } from '../utils/http/api/gateway';
import { ethers } from 'ethers';
import { parseFixed } from '@ethersproject/bignumber';
import { fetchFeeData, Chain, FetchFeeDataResult} from '@wagmi/core';
import { localhost } from '@wagmi/core/chains'
import { btcToken } from 'srcPath/config/constants';

type Price = {
  price: number;
  timestamp: number;
  symbol: string;
};
type GasLimitType = 'StandardTransfer' | 'Erc20Transfer' | 'Erc721Transfer' | 'USDTTransfer';

enum GasLimitTypeEnum {
  StandardTransfer = 'StandardTransfer',
  Erc20Transfer = 'Erc20Transfer',
  Erc721Transfer = 'Erc721Transfer',
  USDTTransfer = 'USDTTransfer',
}
type FeeOptions = {
  name: string;
  speed: string;
  feeDesc: string;
  fee: number;
};
type UserConfig = {
  meplus_enable: boolean;
  nns_enable: boolean;
};

type ChainBrowser = {
  setting: any[];
  address: any[];
  hash: any[];
};

type GasEstimate = {
  network: string;
  trxTypeGasLimit: { type: GasLimitType; gasLimit: number }[];
  gasPriceEstimate: {
    gasMode: { speed: string; maxFeePerGas: number; maxPriorityFeePerGas: number; gasPrice: number; gasFee: number; time: number }[];
    lastBlock: number;
  };
} & FetchFeeDataResult;

type SettingProps = {
  newPrices: {
    [key: string]: Price;
  };
  gasEstimate: {
    [key: string]: GasEstimate;
  } | null;
  feeOptions: FeeOptions[];
  selectFeeIndex: number;
  userConfig: UserConfig | null;
  chainBrowserConfig: {
    [key: string]: ChainBrowser;
  };
  tokensConfig: {
    [key: string]: UserToken[];
  };
  nftConfigs: {
    list: CollectionsType[];
    dataList: CollectionsType[];
    pageNum: number;
    pageSize: number;
    total: number;
    totalPage: number;
    isLoading: boolean;
  };
  networksConfig: Chain[];
};
export const setting = createModel<RootModel>()({
  state: {
    newPrices: new LocalStorage().get(LSKeyEnum.PRICES) ? JSON.parse(new LocalStorage().get(LSKeyEnum.PRICES)!) : {},
    gasEstimate: new LocalStorage().get(LSKeyEnum.GAS_ESTIMATE) ? JSON.parse(new LocalStorage().get(LSKeyEnum.GAS_ESTIMATE)!) : {},
    feeOptions:[],
    email: '',
    selectFeeIndex: 1,
    gaEnabled: undefined,
    userConfig: new LocalStorage().get(LSKeyEnum.USER_CONFIG) ? JSON.parse(new LocalStorage().get(LSKeyEnum.USER_CONFIG)!) : null,
    chainBrowserConfig: new LocalStorage().get(LSKeyEnum.BLOCK_EXPLORERS) ? JSON.parse(new LocalStorage().get(LSKeyEnum.BLOCK_EXPLORERS)!) : {},
    hiddenBalance: new LocalStorage().get(LSKeyEnum.HIDDEN_BALANCE) ? true : false,
    tokensConfig: new LocalStorage().get(LSKeyEnum.TOKENS_CONFIG) ? JSON.parse(new LocalStorage().get(LSKeyEnum.TOKENS_CONFIG)!) : {},
    nftConfigs: {
      list: [],
      dataList: [],
      pageNum: 1,
      pageSize: 20,
      total: 10,
      totalPage: 1,
      isLoading: false,
    },
    networksConfig: new LocalStorage().get(LSKeyEnum.NETWORKS_CONFIG) ? JSON.parse(new LocalStorage().get(LSKeyEnum.NETWORKS_CONFIG)!) : [],
  
  } as SettingProps,
  reducers: {
    save(state: SettingProps, payload) {
      return {
        ...state,
        ...payload,
      };
    },
  },
  effects: dispatch => ({
    async getNewPrices(payload: { symbol: string }, rootState): Promise<Price> {
      const old = rootState.setting.newPrices;
      try {
        const response = await getSymbolPrices({ ...payload });
        const newPrices = {
          ...old,
          [payload.symbol]: response.data,
        };
        dispatch.setting.save({
          newPrices,
        });
        new LocalStorage().set(LSKeyEnum.PRICES, JSON.stringify(newPrices));
        return response.data;
      } catch (err) {
        return old[payload.symbol];
      }
    },
    async getFee(payload, rootState): Promise<FeeOptions[]> {
      const result = await inscribeFee();
      // const result1 = await inscribeFee1();
      console.log("result", result);
      const fee = result.data;
      const feeArray = [fee.economyFee, fee.hourFee, fee.fastestFee];
      const feeOptions = [
        {
          name: "Slow",
          speed: "< 6 hours",
          feeDesc: "{fee} sats / vB",
          fee: 0,
        },
        {
          name: "General",
          speed: "< 1 hour",
          feeDesc: "{fee} sats / vB",
          fee: 0,
        },
        {
          name: "Fast",
          speed: "< 30 minutes",
          feeDesc: "{fee} sats / vB",
          fee: 0,
        },
      ].map((o, index) => ({
        ...o,
        feeDesc: o.feeDesc.replace("{fee}", feeArray[index]),
        fee: feeArray[index],
      }));
      dispatch.setting.save({ feeOptions });
      return feeOptions;
    },
    async getGasEstimate(payload: { currentToken: UserToken; gasLimitRep?: string }, rootState) {
      const { currentToken, gasLimitRep } = payload;
      const { selectNetwork } = rootState.app;
      const { gasEstimate } = rootState.setting;
      try {
        const res = await getGasEstimate({ network: selectNetwork.network });
        const gasEst: GasEstimate = res.data.find((o: { network: string; }) => o.network === selectNetwork.network);
        const standard = currentToken
          ? currentToken.symbol === 'USDT'
            ? GasLimitTypeEnum.USDTTransfer
            : GasLimitTypeEnum.Erc20Transfer
          : GasLimitTypeEnum.StandardTransfer;
        const gasLimit = gasEst.trxTypeGasLimit.find(o => o.type === standard)?.gasLimit;
        console.log('BigNumber gasLimit', gasLimit, gasLimitRep);
        const getGasFeeFormat = await fetchFeeData({ chainId: selectNetwork.id, formatUnits: 'gwei' });
        console.log('getGasFeeFormat', getGasFeeFormat);
        const gasFeeModes = gasEst.gasPriceEstimate.gasMode.map((gasObj, index) => {
          const indexs = [0.9, 1, 1.2]
          const maxFeePerGas = gasObj.maxFeePerGas
          // const gasFee = (Number(gasLimit) * ((maxFeePerGas * indexs[index]) + 40)).toFixed(0);
          const gasFee = (Number(gasLimit) * ((maxFeePerGas))).toFixed(0);
          return {
            ...gasObj,
            gasFee: ethers.utils.formatUnits(parseFixed(gasFee), 9),
            time: gasObj.speed === 'Fast' ? 15 : 30,
          };
        });
        const storeGasEst = {
          ...gasEstimate,
          [selectNetwork.network]: {
            ...gasEst,
            gasPriceEstimate: {
              ...gasEst.gasPriceEstimate,
              gasMode: gasFeeModes,
            },
            ...getGasFeeFormat
          },
        };
        dispatch.setting.save({
          gasEstimate: storeGasEst,
        });
        console.log('storeGasEst', storeGasEst);
        new LocalStorage().set(LSKeyEnum.GAS_ESTIMATE, JSON.stringify(storeGasEst));
      } catch (err) {
        console.log('err', err);
      }
    },
    async getUserConfig(payload): Promise<UserConfig | undefined> {
      try {
        const res = await queryUserConfigure({ username: payload.userName });
        if (res.data) {
          dispatch.setting.save({
            userConfig: res.data,
          });
          new LocalStorage().set(LSKeyEnum.USER_CONFIG, JSON.stringify(res.data));
          return res.data;
        }
      } catch (err) {
        console.log('err', err);
      }
    },
    async getChainBrowserConfig(payload, rootState): Promise<void> {
      try {
        const { selectNetwork } = rootState.app;
        const chainBrowserConfig = rootState.setting.chainBrowserConfig;
        // if (rootState.setting.chainBrowserConfig[selectNetwork.network] && !payload.refresh) return;
        // const { data: setting } = await queryChainBrowser({ username: payload.userName, blockChain: selectNetwork.network });
        // const { data: address } = await queryChainBrowser({ username: payload.userName, blockChain: selectNetwork.network, type: 1 });
        const { data: hash } = await queryChainBrowser({ username: payload.userName, blockChain: selectNetwork.network, type: 2 });
        const store_BlockExplorers = {
          ...chainBrowserConfig,
          [selectNetwork.network]: {
            // setting,
            // address,
            hash,
          },
        };
        dispatch.setting.save({
          chainBrowserConfig: store_BlockExplorers,
        });
        new LocalStorage().set(LSKeyEnum.BLOCK_EXPLORERS, JSON.stringify(store_BlockExplorers));
      } catch (err) {
        console.log('getChainBrowserConfig err', err);
      }
    },
    async getTokensConfig(payload: { refresh?: boolean; [key: string]: any }, rootState) {
      try {
        const { selectNetwork } = rootState.app;
        const { tokensConfig } = rootState.setting;
        let tokenList;
        if(selectNetwork.network === 'bitcoin') {
          tokenList = btcToken;
        } else {
          const res = await getTokenList({ ...payload, blockChain: selectNetwork.network, pageNum: 1, pageSize: 1000 });
          tokenList = res.data?.list;
        }
      
        const tokens: UserToken[] = tokenList.map((o: UserToken) => ({
          ...o,
        }));
        console.log('tokens=====', tokens);
        const store_tokensConfig = {
          ...tokensConfig,
          [selectNetwork.network]: tokens.filter(o=> {
            if(selectNetwork.network === "IC") {
              return o.symbol === 'ckBTC'
            } else {
              return o.symbol === selectNetwork.nativeCurrency.symbol 
            }
          }),
        };
        dispatch.setting.save({
          tokensConfig: store_tokensConfig,
        });
      } catch (err) {
        console.log('err', err);
      }
    },
    async getNftConfig(payload, rootState) {
      const curNftConfig = rootState.setting.nftConfigs;
      const { selectNetwork } = rootState.app;
      dispatch.setting.save({ nftConfigs: { ...curNftConfig, isLoading: true } });
      try {
        const res = await getNftList({ ...payload, pageNum: payload.pageNum !== undefined ? payload.pageNum : curNftConfig.pageNum + 1 });
        // const dataList = payload.pageNum === 1 ? res.data.list : curNftConfig.dataList.concat(res.data.list);
        // const storage = new LocalStorage(localStorage.getItem(LSKeyEnum.USER_NAME)!, selectNetwork.network);
        // console.log('tokens', res);
        // const localOptions: string[] = storage.get(LSKeyEnum.LOCAL_NFTS_SORT) !== null ? JSON.parse(storage.get(LSKeyEnum.LOCAL_NFTS_SORT)!) : [];
        const nfts = res.data.list.map((o: CollectionsType) => ({
          ...o,
          disabled: true,
        }));
        // console.log('nftsConfig==1', nfts);
        dispatch.setting.save({
          nftConfigs: {
            ...res.data,
            // list: nfts,
            list: payload.page !== undefined ? nfts : curNftConfig.list.concat(nfts ?? []),

            isLoading: false,
          },
        });
      } catch (err) {
        dispatch.setting.save({ nftConfigs: { ...curNftConfig, isLoading: false } });
      }
    },
    async getNetworksConfig(payload) {
      try {
        const result = await queryMultichainNetworkConfig(payload);
        const formatData = result.data.map((o: { rpcProviders: { url: any; }[]; }) => ({
          ...o,
          rpcUrls: {
            default: { http: [o.rpcProviders[0].url] },
            public: { http: [o.rpcProviders[0].url] },
          },
        }));
        console.log('formatData', formatData);
        const filterNetworksConfig = formatData.filter((o: { id: number; }) => o.id !== 0);
        // .filter(o => o.id !== 43114)
        // .filter(o => o.id !== 43113)
        // .filter(o => o.id !== 56)
        // .filter(o => o.id !== 97)
        if (!process.env.isProduction) {
          filterNetworksConfig.push(localhost);
        }
        const storeNetworkConfig = filterNetworksConfig;
        new LocalStorage().set(LSKeyEnum.NETWORKS_CONFIG, JSON.stringify(storeNetworkConfig));
        dispatch.setting.save({
          networksConfig: storeNetworkConfig,
        });
      } catch (err) {
        console.log('err', err);
      }
    },
  }),
});
