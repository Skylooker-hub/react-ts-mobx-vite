import axios, { AxiosResponse } from 'axios';
import { APISchema, createRequestClient } from './request';

interface TestAPISchema extends APISchema {
  '/ip_get': {
    request: {};
    response: {
      origin: string;
    };
  };
  '/delay/:delay_get': {
    request: {
      delay: number;
    };
    response: {};
  };
  '/delay/:delay_post': {
    request: {
      delay: number;
    };
    response: {};
  };
  '/base64/:value_get': {
    request: {
      value: string;
    };
    response: string;
  };
  '/form_post': {
    request: {
      custname: string;
      custtel?: string;
      custemail?: string;
      delivery?: string;
      comments?: string;
    };
    response: AxiosResponse<{
      data: string;
    }>;
  };
  getLocalStorageValue: {
    request: {
      key: string;
    };
    response: string | null;
  };
}

const api = createRequestClient<TestAPISchema>({
  baseURL: 'https://httpbin.org/',
  timeout: 5000,
  errorHandler: err => {
    console.log('统一错误处理', err);
    return err;
  },
  requestInterceptor(config) {
    console.log('请求拦截！！');
    return Promise.resolve(config);
  },
  responseInterceptor(res) {
    console.log('响应拦截！！');
    // 这里对axios响应对象进行了处理
    return Promise.resolve(res.data);
  },
  apis: {
    '/ip_get': 'GET /ip',
    '/delay/:delay_get': {
      url: '/delay/:delay',
      method: 'GET',
    },
    '/delay/:delay_post': 'POST /delay/:delay',
    '/base64/:value_get': 'GET /base64/:value',
    '/form_post'({ custname }, options) {
      const data = new URLSearchParams();
      data.append('custname', custname);
      return axios.post('https://httpbin.org/post', data, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        ...options,
      });
    },
    getLocalStorageValue({ key }) {
      return Promise.resolve(localStorage.getItem(key));
    },
  },
});

export default api;
