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

type RequiredArray<T, K extends Array<string | number | symbol>> = {
  [Key in keyof T as Includes<K, Key> extends true ? Key : never]-?: T[Key];
} & OmitArray<T, K>;

/**  路径配置 */
type RequestPath = `${RequestOptions['method']} ${string}`;

/**  选项配置 */
type RequestOptions = RequiredArray<
  OmitArray<AxiosRequestConfig, ['params', 'data']>,
  ['url', 'method']
>;

/**  自定义函数 */
type RequestFunction<P = Record<string, any>, R = any> = (
  params: P,
  options?: AxiosRequestConfig
) => Promise<R>;

type APIConfig = RequestPath | RequestOptions;

type HeaderHandler = (config?: AxiosRequestConfig) => Promise<AxiosRequestHeaders>;
type RequestErrorHandler = (error: AxiosError) => void;

type APIType = {
  request: Record<string, any>;
  response: any;
};

/** 接口约束 */
type APISchema = Record<string, APIType>;

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
    [K in keyof RemoveIndexSignature<T>]:
      | RequestFunction<
          RemoveIndexSignature<T>[K]['request'],
          RemoveIndexSignature<T>[K]['response']
        >
      | APIConfig;
  };
} & OmitArray<AxiosRequestConfig, ['url', 'method', 'params', 'data']>;

/**  创建请求客户端的类型约束 */
type CreateRequestClient<T extends APISchema> = {
  [K in keyof RemoveIndexSignature<T>]: RequestFunction<
    RemoveIndexSignature<T>[K]['request'],
    RemoveIndexSignature<T>[K]['response']
  >;
};
