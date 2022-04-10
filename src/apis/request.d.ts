import { AxiosRequestHeaders, AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';

/** 去除可索引签名 */
type RemoveIndexSignature<Obj extends Record<string, any>> = {
  [Key in keyof Obj as Key extends `${infer Str}` ? Str : never]: Obj[Key];
};

type Includes<Arr extends unknown[], FindItem> = Arr extends [infer First, ...infer Rest]
  ? IsEqual<First, FindItem> extends true
    ? true
    : Includes<Rest, FindItem>
  : false;

/**  类型相等 */
type IsEqual<A, B> = (A extends B ? true : false) & (B extends A ? true : false);

type OmitArray<T, K extends Array<string | number | symbol>> = {
  [Key in keyof T as Includes<K, Key> extends true ? never : Key]: T[Key];
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
  options?: Omit<AxiosRequestConfig, 'method'>
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
  /** 动态添加header */
  headerHandlers?: Array<HeaderHandler>;
  /** 错误处理 */
  errorHandler?: RequestErrorHandler;
  /** 拦截请求 */
  requestInterceptor?: (config: AxiosRequestConfig) => Promise<AxiosRequestConfig>;
  /** 拦截响应 */
  responseInterceptor?: (res: AxiosResponse) => Promise<AxiosResponse>;
  apis: {
    [K in keyof RemoveIndexSignature<T>]: APIConfig;
  };
} & OmitArray<AxiosRequestConfig, ['url', 'method']>;

/**  创建请求客户端的类型约束 */
type CreateRequestClient<T extends APISchema> = {
  [K in keyof RemoveIndexSignature<T>]: RequestFunction<
    RemoveIndexSignature<T>[K]['request'],
    AxiosResponse<RemoveIndexSignature<T>[K]['response']>
  >;
};
