import { APISchema, createRequestClient } from "./request";

interface TestAPISchema extends APISchema {
  getUserName: {
    request: {
      id: number;
    };
    response: {
      name: string;
    };
  };
}

const api = createRequestClient<TestAPISchema>({
  baseURL: "",
  apis: {
    getUserName: {
      method: "GET",
      url: "123/getUserName",
    },
  },
});

export default api;
