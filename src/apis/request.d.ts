import { AxiosRequestHeaders, AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';

/** 去除可索引签名 */
type RemoveIndexSignature<Obj extends Record<string, any>> = {
  [Key in keyof Obj as Key extends `${infer Str}` ? Str : never]: Obj[Key];
};

/**  路径配置 */
type RequestPath = `${Uppercase<RequestOptions['method']>} ${string}`;

/**  选项配置 */
type RequestOptions = {
  url: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'HEAD' | 'OPTIONS' | 'CONNECT' | 'TRACE' | 'PATCH';
  headers?: AxiosRequestHeaders;
};

/**  自定义函数 */
type RequestFunction<P = Record<string, any> | void, R = any> = (
  params: P,
  ...args: any[]
) => Promise<R>;

type APIConfig = RequestPath | RequestOptions | RequestFunction;

type HeaderHandler = (config?: AxiosRequestConfig) => Promise<AxiosRequestHeaders>;
type RequestErrorHandler = (error: AxiosError) => void;

/** 接口约束 */
type APISchema = Record<
  string,
  {
    request: Record<string, any>;
    response: Record<string, any>;
  }
>;

type CreateRequestConfig<T extends APISchema> = {
  baseURL: string;
  headers?: AxiosRequestHeaders;
  headerHandlers?: Array<HeaderHandler>;
  errorHandler?: RequestErrorHandler;
  apis: {
    [K in keyof RemoveIndexSignature<T>]: APIConfig;
  };
};

/**  创建请求客户端的类型约束 */
type CreateRequestClient<T extends APISchema> = {
  [K in keyof RemoveIndexSignature<T>]: RequestFunction<
    RemoveIndexSignature<T>[K]['request'],
    AxiosResponse<RemoveIndexSignature<T>[K]['response']>
  >;
};
