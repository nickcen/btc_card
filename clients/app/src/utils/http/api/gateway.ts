import { ASTROX_GATEWAY } from '../../../config/constants';

import { MyRequest } from '../';
import { GATEWAY_API } from './path';
const gateWayRequest = new MyRequest({
  baseURL: ASTROX_GATEWAY,
  // baseURL: 'http://localhost:9999/api',
  headers: {
    'Content-Type': 'application/json',
  },
});



// const aaRequest = new MyRequest({
//   baseURL: 'http://54.179.159.93:8089/oper-api/',
//   // baseURL: 'http://localhost:9999/api',
//   headers: {
//     'Content-Type': 'application/json',
//   },
// });

// export function sendActivateCode(data:any) {
//     return aaRequest.xRequest({
//     data,
//     url: '/aa/sendActivateCode',
//     method: 'post',
//   });
// }



const ordRequest = new MyRequest({
  baseURL: 'https://ordapi.astrox.app/v1',
  // baseURL: 'http://localhost:9999/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

export function inscribeFee(data?:any) {
    return ordRequest.xRequest({
    // data,
    url: '/api/inscribe/fees',
    method: 'post',
  });
}



export function getGasEstimate(data: any) {
  console.log(gateWayRequest);
  return gateWayRequest.xRequest({
    data,
    url: GATEWAY_API.GAS,
    method: 'post',
  });
}

export function getSymbolPrices(data: any) {
  console.log(gateWayRequest);
  return gateWayRequest.xRequest({
    data,
    notTips: true,
    url: GATEWAY_API.PRICES,
    method: 'post',
  });
}
