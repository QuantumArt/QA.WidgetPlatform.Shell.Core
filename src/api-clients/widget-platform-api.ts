/* eslint-disable */
/* tslint:disable */
/*
 * ---------------------------------------------------------------
 * ## THIS FILE WAS GENERATED VIA SWAGGER-TYPESCRIPT-API        ##
 * ##                                                           ##
 * ## AUTHOR: acacode                                           ##
 * ## SOURCE: https://github.com/acacode/swagger-typescript-api ##
 * ---------------------------------------------------------------
 */

export interface FieldInfo {
  value?: any;
}

export interface ProblemDetails {
  type?: string | null;
  title?: string | null;
  /** @format int32 */
  status?: number | null;
  detail?: string | null;
  instance?: string | null;
  [key: string]: any;
}

/** Элемент структуры сайта с информацией по всем полям */
export interface SimpleSiteNodeDetails {
  /** @format int32 */
  id?: number;
  details?: Record<string, FieldInfo>;
}

/** Элемент структуры сайта */
export interface SiteNode {
  /** @format int32 */
  id?: number;
  alias?: string | null;
  nodeType?: string | null;
  frontModuleUrl?: string | null;
  frontModuleName?: string | null;
  children?: SiteNode[] | null;
  details?: Record<string, FieldInfo>;
}

/** Элемент структуры сайта с информацией по всем полям */
export interface SiteNodeDetails {
  /** @format int32 */
  id?: number;
  alias?: string | null;
  nodeType?: string | null;
  details?: Record<string, FieldInfo>;
}

/** Виджет */
export interface WidgetDetails {
  /** @format int32 */
  id?: number;
  alias?: string | null;
  nodeType?: string | null;
  details?: Record<string, FieldInfo>;
  zone?: string | null;
  frontModuleUrl?: string | null;
  frontModuleName?: string | null;
  allowedUrlPatterns?: string[] | null;
  deniedUrlPatterns?: string[] | null;
  /** Дочерние виджеты, сгруппированные по зонам */
  childWidgets?: Record<string, WidgetDetails[]>;
}

export type QueryParamsType = Record<string | number, any>;
export type ResponseFormat = keyof Omit<Body, 'body' | 'bodyUsed'>;

export interface FullRequestParams extends Omit<RequestInit, 'body'> {
  /** set parameter to `true` for call `securityWorker` for this request */
  secure?: boolean;
  /** request path */
  path: string;
  /** content type of request body */
  type?: ContentType;
  /** query params */
  query?: QueryParamsType;
  /** format of response (i.e. response.json() -> format: "json") */
  format?: ResponseFormat;
  /** request body */
  body?: unknown;
  /** base url */
  baseUrl?: string;
  /** request cancellation token */
  cancelToken?: CancelToken;
}

export type RequestParams = Omit<FullRequestParams, 'body' | 'method' | 'query' | 'path'>;

export interface ApiConfig<SecurityDataType = unknown> {
  baseUrl?: string;
  baseApiParams?: Omit<RequestParams, 'baseUrl' | 'cancelToken' | 'signal'>;
  securityWorker?: (
    securityData: SecurityDataType | null,
  ) => Promise<RequestParams | void> | RequestParams | void;
  customFetch?: typeof fetch;
}

export interface HttpResponse<D extends unknown, E extends unknown = unknown> extends Response {
  data: D;
  error: E;
}

type CancelToken = Symbol | string | number;

export enum ContentType {
  Json = 'application/json',
  FormData = 'multipart/form-data',
  UrlEncoded = 'application/x-www-form-urlencoded',
  Text = 'text/plain',
}

export class HttpClient<SecurityDataType = unknown> {
  public baseUrl: string = '';
  private securityData: SecurityDataType | null = null;
  private securityWorker?: ApiConfig<SecurityDataType>['securityWorker'];
  private abortControllers = new Map<CancelToken, AbortController>();
  private customFetch = (...fetchParams: Parameters<typeof fetch>) => fetch(...fetchParams);

  private baseApiParams: RequestParams = {
    credentials: 'same-origin',
    headers: {},
    redirect: 'follow',
    referrerPolicy: 'no-referrer',
  };

  constructor(apiConfig: ApiConfig<SecurityDataType> = {}) {
    Object.assign(this, apiConfig);
  }

  public setSecurityData = (data: SecurityDataType | null) => {
    this.securityData = data;
  };

  protected encodeQueryParam(key: string, value: any) {
    const encodedKey = encodeURIComponent(key);
    return `${encodedKey}=${encodeURIComponent(typeof value === 'number' ? value : `${value}`)}`;
  }

  protected addQueryParam(query: QueryParamsType, key: string) {
    return this.encodeQueryParam(key, query[key]);
  }

  protected addArrayQueryParam(query: QueryParamsType, key: string) {
    const value = query[key];
    return value.map((v: any) => this.encodeQueryParam(key, v)).join('&');
  }

  protected toQueryString(rawQuery?: QueryParamsType): string {
    const query = rawQuery || {};
    const keys = Object.keys(query).filter(key => 'undefined' !== typeof query[key]);
    return keys
      .map(key =>
        Array.isArray(query[key])
          ? this.addArrayQueryParam(query, key)
          : this.addQueryParam(query, key),
      )
      .join('&');
  }

  protected addQueryParams(rawQuery?: QueryParamsType): string {
    const queryString = this.toQueryString(rawQuery);
    return queryString ? `?${queryString}` : '';
  }

  private contentFormatters: Record<ContentType, (input: any) => any> = {
    [ContentType.Json]: (input: any) =>
      input !== null && (typeof input === 'object' || typeof input === 'string')
        ? JSON.stringify(input)
        : input,
    [ContentType.Text]: (input: any) =>
      input !== null && typeof input !== 'string' ? JSON.stringify(input) : input,
    [ContentType.FormData]: (input: any) =>
      Object.keys(input || {}).reduce((formData, key) => {
        const property = input[key];
        formData.append(
          key,
          property instanceof Blob
            ? property
            : typeof property === 'object' && property !== null
            ? JSON.stringify(property)
            : `${property}`,
        );
        return formData;
      }, new FormData()),
    [ContentType.UrlEncoded]: (input: any) => this.toQueryString(input),
  };

  protected mergeRequestParams(params1: RequestParams, params2?: RequestParams): RequestParams {
    return {
      ...this.baseApiParams,
      ...params1,
      ...(params2 || {}),
      headers: {
        ...(this.baseApiParams.headers || {}),
        ...(params1.headers || {}),
        ...((params2 && params2.headers) || {}),
      },
    };
  }

  protected createAbortSignal = (cancelToken: CancelToken): AbortSignal | undefined => {
    if (this.abortControllers.has(cancelToken)) {
      const abortController = this.abortControllers.get(cancelToken);
      if (abortController) {
        return abortController.signal;
      }
      return void 0;
    }

    const abortController = new AbortController();
    this.abortControllers.set(cancelToken, abortController);
    return abortController.signal;
  };

  public abortRequest = (cancelToken: CancelToken) => {
    const abortController = this.abortControllers.get(cancelToken);

    if (abortController) {
      abortController.abort();
      this.abortControllers.delete(cancelToken);
    }
  };

  public request = async <T = any, E = any>({
    body,
    secure,
    path,
    type,
    query,
    format,
    baseUrl,
    cancelToken,
    ...params
  }: FullRequestParams): Promise<HttpResponse<T, E>> => {
    const secureParams =
      ((typeof secure === 'boolean' ? secure : this.baseApiParams.secure) &&
        this.securityWorker &&
        (await this.securityWorker(this.securityData))) ||
      {};
    const requestParams = this.mergeRequestParams(params, secureParams);
    const queryString = query && this.toQueryString(query);
    const payloadFormatter = this.contentFormatters[type || ContentType.Json];
    const responseFormat = format || requestParams.format;

    return this.customFetch(
      `${baseUrl || this.baseUrl || ''}${path}${queryString ? `?${queryString}` : ''}`,
      {
        ...requestParams,
        headers: {
          ...(requestParams.headers || {}),
          ...(type && type !== ContentType.FormData ? { 'Content-Type': type } : {}),
        },
        signal: cancelToken ? this.createAbortSignal(cancelToken) : requestParams.signal,
        body: typeof body === 'undefined' || body === null ? null : payloadFormatter(body),
      },
    ).then(async response => {
      const r = response as HttpResponse<T, E>;
      r.data = null as unknown as T;
      r.error = null as unknown as E;

      const data = !responseFormat
        ? r
        : await response[responseFormat]()
            .then(data => {
              if (r.ok) {
                r.data = data;
              } else {
                r.error = data;
              }
              return r;
            })
            .catch(e => {
              r.error = e;
              return r;
            });

      if (cancelToken) {
        this.abortControllers.delete(cancelToken);
      }

      if (!response.ok) throw data;
      return data;
    });
  };
}

/**
 * @title Widget Platform API
 * @version v1
 */
export class Api<SecurityDataType extends unknown> extends HttpClient<SecurityDataType> {
  site = {
    /**
     * No description
     *
     * @tags Site
     * @name WarmupList
     * @request GET:/Site/Warmup
     */
    warmupList: (params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/Site/Warmup`,
        method: 'GET',
        ...params,
      }),

    /**
     * No description
     *
     * @tags Site
     * @name StructureList
     * @summary Получение структуры страниц сайта
     * @request GET:/Site/structure
     */
    structureList: (
      query: {
        /** Доменное имя сайта */
        dnsName: string;
        /** Словарь значений таргетирования */
        t?: Record<string, string>;
        /** Поля деталей к выдаче. Если пусто, то детали выдаваться не будут */
        fields?: string[];
        /**
         * Глубина страуктуры, где 0 - это корневой элемент
         * @format int32
         */
        deep?: number;
        /**
         * Заполнять дополнительные поля из дефинишена
         * @default false
         */
        fillDefinitionDetails?: boolean;
      },
      params: RequestParams = {},
    ) =>
      this.request<SiteNode, ProblemDetails>({
        path: `/Site/structure`,
        method: 'GET',
        query: query,
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @tags Site
     * @name DetailsList
     * @summary Получение массива нод, удовлетворяющих переданным фильтрам
     * @request GET:/Site/details
     */
    detailsList: (
      query: {
        /** Доменное имя сайта */
        dnsName: string;
        /** Словарь значений таргетирования */
        t?: Record<string, string>;
        /** Поля деталей к выдаче. Если пусто, то будут выведены все детали */
        fields?: string[];
      },
      params: RequestParams = {},
    ) =>
      this.request<SimpleSiteNodeDetails[], ProblemDetails>({
        path: `/Site/details`,
        method: 'GET',
        query: query,
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @tags Site
     * @name NodeDetail
     * @summary Получение детальной информации по странице или виджету
     * @request GET:/Site/node/{nodeId}
     */
    nodeDetail: (nodeId: number, params: RequestParams = {}) =>
      this.request<SiteNodeDetails, ProblemDetails>({
        path: `/Site/node/${nodeId}`,
        method: 'GET',
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @tags Site
     * @name WidgetsDetail
     * @summary Получение виджетов для страницы или виджета, сгруппированных по зонам
     * @request GET:/Site/widgets/{abstractItemId}
     */
    widgetsDetail: (
      abstractItemId: number,
      query?: {
        /** Словарь значений таргетирования */
        t?: Record<string, string>;
        /** Список виджетных зон (если не передавать, то поиск виджетов не будет производиться для рекурсивных и глобальных зон) */
        zones?: string[];
        /**
         * Заполнять дополнительные поля из дефинишена
         * @default false
         */
        fillDefinitionDetails?: boolean;
      },
      params: RequestParams = {},
    ) =>
      this.request<Record<string, WidgetDetails[]>, ProblemDetails>({
        path: `/Site/widgets/${abstractItemId}`,
        method: 'GET',
        query: query,
        format: 'json',
        ...params,
      }),
  };
}
