import axios, { AxiosInstance, AxiosRequestHeaders, AxiosError, Method } from 'axios';
import {
  APISchema,
  APIType,
  CreateRequestClient,
  CreateRequestConfig,
  RequestFunction,
  RequestOptions,
  RequestPath,
} from './request.d';

export type { APISchema, APIType };

const MATCH_METHOD = /^(GET|POST|PUT|DELETE|HEAD|OPTIONS|LINK|UNLINK|PURGE|PATCH)\s+/i;
const MATCH_PATH_PARAMS = /:(\w+)/g;
const USE_DATA_METHODS = ['POST', 'PUT', 'PATCH', 'DELETE'];

// 创建请求客户端
export function createRequestClient<T extends APISchema>(
  requestConfig: CreateRequestConfig<T>
): CreateRequestClient<T> {
  const {
    apis,
    headerHandlers,
    errorHandler,
    requestInterceptor,
    responseInterceptor,
    ...otherConfigs
  } = requestConfig;
  const client = axios.create(otherConfigs);

  // 附加各业务请求头
  client.interceptors.request.use(
    async config => {
      config = requestInterceptor ? await requestInterceptor(config) : config;

      const headerHandlersPromises = (headerHandlers || []).map((handler, index) => {
        return handler(config)
          .then((mixHeaders: AxiosRequestHeaders) => {
            Object.assign(config.headers, mixHeaders);
          })
          .catch(() => new Error(`headerHandlers[${index}] Error!!! `));
      });
      await Promise.all(headerHandlersPromises);
      return config;
    },
    (error: AxiosError) => {
      const requestError = errorHandler ? errorHandler(error) : error;
      return Promise.reject(requestError);
    }
  );

  // 拦截响应
  client.interceptors.response.use(
    async res => {
      res = responseInterceptor ? await responseInterceptor(res) : res;
      return res;
    },
    (error: AxiosError) => {
      const requestError = errorHandler ? errorHandler(error) : error;
      return Promise.reject(requestError);
    }
  );

  return attachAPI<T>(client, apis);
}

function attachAPI<T extends APISchema>(
  client: AxiosInstance,
  apis: CreateRequestConfig<T>['apis']
): CreateRequestClient<T> {
  const hostApi: CreateRequestClient<T> = Object.create(null);
  for (const apiName in apis) {
    const apiConfig = apis[apiName];
    // 配置为一个函数
    if (typeof apiConfig === 'function') {
      hostApi[apiName] = apiConfig as RequestFunction;
      continue;
    }
    let apiOptions = {};
    let apiPath = apiConfig as RequestPath;
    // 配置为一个对象
    if (typeof apiConfig === 'object') {
      const { url, ...rest } = apiConfig as RequestOptions;
      apiPath = url as RequestPath;
      apiOptions = rest;
    }
    hostApi[apiName] = (params, options = {}) => {
      const _params = { ...(params || {}) };
      // 匹配路径中请求方法，如：'POST /api/test'
      const [prefix, method] = apiPath.match(MATCH_METHOD) || ['GET ', 'GET'];
      // 剔除掉 ”POST “ 前缀
      let url = apiPath.replace(prefix, '');
      // 匹配路径中的参数占位符， 如 '/api/:user_id/:res_id'
      const matchParams = apiPath.match(MATCH_PATH_PARAMS);
      if (matchParams) {
        matchParams.forEach(match => {
          const key = match.replace(':', '');
          if (Reflect.has(_params, key)) {
            url = url.replace(match, Reflect.get(_params, key));
            Reflect.deleteProperty(_params, key);
          }
        });
      }
      const requestParams = USE_DATA_METHODS.includes(method.toUpperCase())
        ? { data: _params }
        : { params: _params };
      return client.request({
        url,
        method: method as Method,
        ...requestParams,
        ...apiOptions,
        ...options,
      });
    };
  }
  return hostApi;
}
