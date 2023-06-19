import Request from './request';
import { AxiosResponse, AxiosRequestConfig, InternalAxiosRequestConfig } from 'axios';

import type { RequestConfig } from './request/types';
import { ASTROX_API } from '../../config/constants';

export interface YWZResponse<T> {
  code: number;
  data: T;
  message: string;
  success: boolean;
}

// 重写返回类型
interface YWZRequestConfig<T, R> extends RequestConfig<YWZResponse<R>> {
  data?: T;
}

export class MyRequest {
  private request: Request;
  constructor(config: AxiosRequestConfig) {
    this.request = new Request({
      baseURL: config.baseURL,
      timeout: 1000 * 60 * 10,
      interceptors: {
        // 请求拦截器
        requestInterceptors: config => {
          return {
            ...config,
          };
        },
        // 响应拦截器
        responseInterceptors: (result: AxiosResponse) => {
          return result;
        },
      },
    });
    return this;
  }
  xRequest<D = any, T = any>(config: YWZRequestConfig<D, T>) {
    const { method = 'GET' } = config;
    if (method === 'get' || method === 'GET' || method === 'delete' || method === 'DELETE') {
      config.params = config.data;
      config.params = { pageSize: 10, ...config.params };
    } else {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      config.data = { pageSize: 10, ...config.data };
    }
    const response = this.request.request<YWZResponse<T>>(config);

    return response;
  }
  // 取消请求
  cancelRequest = (url: string | string[]) => {
    return this.request.cancelRequest(url);
  };
  // 取消全部请求
  cancelAllRequest = () => {
    return this.request.cancelAllRequest();
  };
}

const request = new Request({
  baseURL: ASTROX_API,
  timeout: 1000 * 60 * 10,
  interceptors: {
    // 请求拦截器
    //@ts-ignore
    requestInterceptors: (config: InternalAxiosRequestConfig) => {
      return {
        ...config,
        headers: {
          contentType: 'application/json;charset=UTF-8',
          'API-Authorization': ASTROX_API.indexOf('test') > -1 ? '123456' : 'd421f9328ae3b90bdd17022fca44fd99366c913c',
        },
      };
    },
    // 响应拦截器
    responseInterceptors: (result: AxiosResponse) => {
      return result;
    },
  },
});

/**
 * @description: 函数的描述
 * @generic D 请求参数
 * @generic T 响应结构
 * @param {YWZRequestConfig} config 不管是GET还是POST请求都使用data
 * @returns {Promise}
 */
const xRequest = <D = any, T = any>(config: YWZRequestConfig<D, T>) => {
  const { method = 'GET' } = config;
  if (method === 'get' || method === 'GET' || method === 'delete' || method === 'DELETE') {
    config.params = config.data;
    config.params = { pageSize: 10, ...config.params };
  } else {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    config.data = { pageSize: 10, ...config.data };
  }
  const response = request.request<YWZResponse<T>>(config);

  return response;
};
// 取消请求
export const cancelRequest = (url: string | string[]) => {
  return request.cancelRequest(url);
};
// 取消全部请求
export const cancelAllRequest = () => {
  return request.cancelAllRequest();
};

export default xRequest;
