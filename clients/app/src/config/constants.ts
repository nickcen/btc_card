import { Chain } from '@wagmi/core'
import {
  polygonMumbai,
  polygon,
  mainnet,
  metisGoerli,
  localhost,
} from '@wagmi/core/chains'
import { TOKEN, ICP } from 'srcPath/utils/resource'

export const ASTROX_API = 'https://op.astrox.app/oper-api'
export const ASTROX_GATEWAY = 'https://gw.astrox.app/gateway'
export const ClientID =
  'BJe_72PwFlLP893wteQZQxOfx0loEN-l7MCCUfTWhDWJNXx0-gYT1yYE-bqh4_OpsJ1-_rn2UZKAbwuoK3M2PE8'
export const GoogleClientID =
  '492916203869-b4lt0ql9vmqjmajree7e1vnn49fq9j4r.controllers.googleusercontent.com'

//test
// export const ClientID = 'BASqNlUVHRUiMpzQfDdjDA4bEs5-pvy1AMVkACJeU51xW9aYFj-Awh9UrhNF4zKxGehyW3UPagjxeG2eJqsGrvo';
// export const GoogleClientID = "492916203869-aqrbjjh0gb35r36nu5qnfd3sijq9j6es.controllers.googleusercontent.com";

export const ICNetwork = {
  name: 'ICP',
  iconUrl: ICP,
  id: 0,
  network: 'IC',
  nativeCurrency: { name: 'ICP', symbol: 'ICP', decimals: 8 },
  rpcUrls: {
    alchemy: {
      http: ['https://eth-mainnet.g.alchemy.com/v2'],
      webSocket: ['wss://eth-mainnet.g.alchemy.com/v2'],
    },
    infura: {
      http: ['https://mainnet.infura.io/v3'],
      webSocket: ['wss://mainnet.infura.io/ws/v3'],
    },
    public: {
      http: ['https://cloudflare-eth.com'],
    },
    default: {
      http: ['https://cloudflare-eth.com'],
    },
  },
  blockExplorers: {
    etherscan: {
      name: 'Etherscan',
      url: 'https://etherscan.io',
    },
    default: {
      name: 'Etherscan',
      url: 'https://etherscan.io',
    },
  },
}

export const BTCNetwork = {
  name: 'BTC',
  iconUrl: TOKEN,
  id: 0,
  network: 'bitcoin',
  nativeCurrency: { name: 'BTC', symbol: 'BTC', decimals: 9 },
  rpcUrls: {
    alchemy: {
      http: ['https://eth-mainnet.g.alchemy.com/v2'],
      webSocket: ['wss://eth-mainnet.g.alchemy.com/v2'],
    },
    infura: {
      http: ['https://mainnet.infura.io/v3'],
      webSocket: ['wss://mainnet.infura.io/ws/v3'],
    },
    public: {
      http: ['https://cloudflare-eth.com'],
    },
    default: {
      http: ['https://cloudflare-eth.com'],
    },
  },
  blockExplorers: {
    etherscan: {
      name: 'Etherscan',
      url: 'https://etherscan.io',
    },
    default: {
      name: 'Etherscan',
      url: 'https://etherscan.io',
    },
  },
  contracts: {
    ensRegistry: {
      address: '0x00000000000C2E074eC69A0dFb2997BA6C7d2e1e',
    },
    multicall3: {
      address: '0xca11bde05977b3631167028862be2a173976ca11',
      blockCreated: 14353601,
    },
  },
} as Chain

export const contractsAddress = {
  localhost: '0x9fe46736679d2d9a65f0992f2272de9f3c7fa6e0',
  polygon: '0x83a80059cb677e366699c564f948183f323d61c4',
  polygonMumbai: '0xF8c761ccB8459cA802a30B408ea53F07Cb4B2075',
}
export const btcToken = [
  {
    blockChain: 'bitcoin',
    contractAddress: '1234',
    createTime: '2023-02-02T17:08:23Z',
    desc: 'BNB Coin is a cryptocurrency that is used primarily to pay transaction and trading fees on the Binance exchange.',
    digits: 9,
    icon: 'https://s3.ap-east-1.amazonaws.com/op.astrox.app/image/token_icon/20230206/bnb.png',
    id: 67,
    name: 'BTC',
    serviceCharge: 0,
    standard: 'BEP20',
    symbol: 'BTC',
    totalSupply: 0.0,
    updateTime: '2023-02-06T12:08:59Z',
    version: 5,
    weight: 1,
  },
]
//@ts-ignore
export const defaultNetwork: Chain & { iconUrl: string } = {
  ...BTCNetwork,
}

export const otherNetworks: (Chain & { iconUrl?: string })[] = [
  // BTCNetwork,
  // mainnet,
]
// export const defaultNetwork: Chain =process.env.NODE_ENV === 'development' ? localhost: polygon;
