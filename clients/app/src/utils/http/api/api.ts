import xRequest, { cancelRequest } from '..';
import { OP_PATH } from './path';

export function getTokenList(data: any) {
  return xRequest({
    data,
    url: OP_PATH.API.TOKEN_LIST,
    method: 'post',
  });
}

export function getNftList(data: any, cancel?: boolean) {
  if (cancel) {
    cancelRequest(OP_PATH.API.NFT_LIST);
  }
  return xRequest({
    data,
    url: OP_PATH.API.NFT_LIST,
    method: 'post',
  });
}

export function queryUserConfigure(data: any) {
  return xRequest({
    data,
    url: OP_PATH.API.USER_CONFIG.QUERY,
    method: 'post',
  });
}

export function saveUserConfigure(data: any) {
  return xRequest({
    data,
    url: OP_PATH.API.USER_CONFIG.SAVE,
    method: 'post',
  });
}

export function queryChainBrowser(data: any) {
  return xRequest({
    data,
    url: OP_PATH.API.CHAIN_BROWSER.QUERY,
    method: 'post',
  });
}

export function saveChainBrowser(data: any) {
  return xRequest({
    data,
    url: OP_PATH.API.CHAIN_BROWSER.SAVE,
    method: 'post',
  });
}

export function getEmail(data: { username: any; }) {
  return xRequest({
    data,
    url: `${OP_PATH.EMAIL.QUERY}?username=${data.username}`,
    method: 'post',
  });
}

export function getEmailCode(data: any) {
  return xRequest({
    data,
    url: OP_PATH.EMAIL.GET_CODE,
    method: 'post',
    notTips: true,
  });
}

export function checkEmailCode(data: any) {
  return xRequest({
    data,
    url: OP_PATH.EMAIL.CHECK_CODE,
    method: 'post',
  });
}

export function bindEmail(data: any) {
  return xRequest({
    data,
    url: OP_PATH.EMAIL.BIND,
    method: 'post',
  });
}

export function unbindEmail(data: any) {
  return xRequest({
    data,
    url: OP_PATH.EMAIL.UNBIND,
    method: 'post',
  });
}

export function updateEmail(data: any) {
  return xRequest({
    data,
    url: OP_PATH.EMAIL.UPDATE,
    method: 'post',
  });
}

export function queryMultichainNetworkConfig(data: any) {
  return xRequest({
    data,
    url: OP_PATH.MULTICHAIN.QUERY,
    method: 'get',
  });
}

export function sendActivateCode(data:any) {
  return xRequest({
  data,
  url: '/aa/sendActivateCode',
  method: 'post',
});
}
