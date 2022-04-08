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
  apis: {
    getUserName: {
      method: 'GET',
      url: '/getUserName',
    },
    getAge: 'GET /gg/user',
  },
});

export default api;
