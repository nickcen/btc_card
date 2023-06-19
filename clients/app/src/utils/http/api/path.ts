const OP_PATH = {
  MULTICHAIN: {
    QUERY: '/multichain/networkConfig',
  },
  CYCLES: {
    TOPUP: '/api/saveUserRechargeRequest',
  },
  EMAIL: {
    QUERY: '/email/get',
    BIND: '/email/bind',
    CHECK_CODE: '/email/checkValidateCode',
    GET_CODE: '/email/getValidateCode',
    UNBIND: '/email/unbind',
    UPDATE: '/email/update',
  },
  API: {
    TOKEN_LIST: '/api/queryTokenList',
    NFT_LIST: '/api/queryNftList',
    USER_CONFIG: {
      QUERY: '/api/queryUserConfigure',
      SAVE: '/api/saveUserConfigure',
    },
    CHAIN_BROWSER: {
      QUERY: '/api/queryChainBrowserList',
      SAVE: '/api/saveUserChainBrowser',
    },
  },
};

const GATEWAY_API = {
  GAS: '/gas/gasEstimate',
  PRICES: '/api/price/latestPrice',
};

export { OP_PATH, GATEWAY_API };
