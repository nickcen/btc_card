import { createClient, configureChains } from "@wagmi/core";
import { jsonRpcProvider } from "@wagmi/core/providers/jsonRpc";
import { localhost, goerli, mainnet, polygon, bsc, polygonMumbai, bscTestnet } from '@wagmi/core/chains';
import {MockConnector} from '@wagmi/core/connectors/mock'
import { useNavigate } from "react-router-dom";
import { HttpService } from "srcPath/services/ord";

export function add (a:number, b: number) {
  return a+b
}

// A `hasOwnProperty` that produces evidence for the typechecker
export function hasOwnProperty<X extends Record<string, unknown>, Y extends PropertyKey>(
  obj: Record<string, unknown>,
  prop: Y,
): obj is X & Record<Y, unknown> {
  return Object.prototype.hasOwnProperty.call(obj, prop);
}


export function delay(time = 2000) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(true)
    }, time)
  })
}

export function getTokenIds(startTokenId: number, size: number) {
  return Array(size)
      .fill('')
      .map((element, index) => index + startTokenId);
}

export type UserIntent = AuthIntent |TransactionIntent | ManageIntent;

export type AuthIntent = { kind: 'auth' };
export type ManageIntent = { kind: 'manage' };
export type TransactionIntent = { kind: 'transaction' };

export const intentFromUrl = (url: URL): UserIntent => {
  if (url.hash == '#authorize') {
    return { kind: 'auth' };
  } else if (url.hash == '#transaction') {
    return { kind: 'transaction' };
  } 
  
  return { kind: 'manage' };
};

export const initWagmiClient = () => {

  const settingProvider = process.env.NODE_ENV === 'production'
  ? [
      // alchemyProvider({ apiKey: 'HI0VvxVjVNhWlmg4A_mM7AzTAkyKU1dW' }),
      // infuraProvider({ apiKey: '471baeba6ccd4228b2d67c626e2991be' }),
      // publicProvider(),
      jsonRpcProvider({
        rpc: curChain => {
          const httpUrl = curChain.rpcUrls.default.http[0] ?? curChain.rpcUrls.public.http[0];
          return {
            http: httpUrl.replace('${INFURA_API_KEY}', '471baeba6ccd4228b2d67c626e2991be'),
          };
        },
      }),
    ]
  : [
      jsonRpcProvider({
        rpc: curChain => {
          if (curChain.id === localhost.id) {
            return {
              http: 'http://127.0.0.1:8545/',
            };
          }
          return {
            http: curChain.network === 'bsc' ? 'https://1rpc.io/bnb' :  curChain.network === 'bsc-testnet' ? 'https://api-testnet.bscscan.com/EVTS3CU31AATZV72YQ55TPGXGMVIFUQ9M9':  curChain.rpcUrls.default.http[0],
          };
        },
      }),
    ];
  //@ts-ignore
  const { chains, provider, webSocketProvider } = configureChains([ bsc, bscTestnet, polygon, polygonMumbai, localhost, goerli, mainnet], settingProvider);
 
  const client =  createClient({
    provider,
    webSocketProvider,
  });

  return { chains, client };
}


export const ordService = new HttpService({
  host: 'https://unisat.io/api',
  fetchOptions: {
    headers: {
      'X-Client': 'UniSat Wallet',
      'X-Version': '1.1.12',
      'Content-Type': 'application/json;charset=utf-8',
    },
  },
});

