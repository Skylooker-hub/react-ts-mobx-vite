import { APISchema, createRequestClient } from './request';

interface TestAPISchema extends APISchema {
  getUserName: {
    request: {
      id: number;
    };
    response: {
      name: string;
    };
  };
  getAge: {
    request: {};
    response: {};
  };
}

const api = createRequestClient<TestAPISchema>({
  baseURL: '',
  requestInterceptor(config) {
    return Promise.resolve(config);
  },
  responseInterceptor(res) {
    return Promise.resolve(res);
  },
  apis: {
    getUserName: {
      method: 'GET',
      url: '/getUserName',
    },
    getAge: 'GET /gg/user',
  },
});

export default api;
