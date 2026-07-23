import axios, {
  AxiosRequestConfig,
  AxiosRequestHeaders,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from 'axios';
import {
  QueryKey,
  useMutation,
  UseMutationOptions,
  useQuery,
  UseQueryOptions,
} from '@tanstack/react-query';
import { hideLoader, showLoader } from '../redux/slice/screenSlice';
import { store } from '../redux/store';
import { setToken } from '../redux/slice/roleSlice';

const baseURL = 'https://gifts360.crmutilitylive.com/api/v1/';

const instance = axios.create({
  baseURL,
  timeout: 10000,
});

const refreshInstance = axios.create({
  baseURL,
  timeout: 10000,
});

let isRefreshing = false;
let refreshSubscribers: Array<(token: string | null) => void> = [];

const subscribeTokenRefresh = (callback: (token: string | null) => void) => {
  refreshSubscribers.push(callback);
};

const notifyTokenRefresh = (token: string | null) => {
  refreshSubscribers.forEach(callback => callback(token));
  refreshSubscribers = [];
};

const INVALID_AUTH_TOKEN_VALUES = new Set([
  'undefined',
  'null',
  'bearer',
  '[object object]',
]);

export const normalizeAuthToken = (token: unknown): string => {
  if (typeof token !== 'string') {
    return '';
  }

  const normalizedToken = token
    .trim()
    .replace(/^Bearer\s+/i, '')
    .trim();

  if (
    !normalizedToken ||
    INVALID_AUTH_TOKEN_VALUES.has(normalizedToken.toLowerCase())
  ) {
    return '';
  }

  return normalizedToken;
};

const getAuthorizationTokenFromHeaders = (
  headers: InternalAxiosRequestConfig['headers'],
): string => {
  const headerReader = headers as AxiosRequestHeaders & {
    get?: (name: string) => unknown;
  };

  const headerValue =
    typeof headerReader.get === 'function'
      ? headerReader.get('Authorization')
      : (headers as Record<string, unknown>).Authorization ||
        (headers as Record<string, unknown>).authorization;

  return normalizeAuthToken(headerValue);
};

const normalizeCountryCodeForHeader = (countryCode?: string | null) =>
  countryCode?.trim().toLowerCase() || '';

const refreshAccessToken = async (): Promise<string | null> => {
  const { refreshToken, currentAddress, languageSelect } =
    store.getState().role;

  if (!refreshToken) {
    return null;
  }

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  if (languageSelect) {
    headers['x-app-language'] = languageSelect;
  }

  const response = await refreshInstance.post(
    'auth/refresh',
    {
      refreshToken,
    },
    { headers },
  );

  const newAccessToken = normalizeAuthToken(response?.data?.data?.accessToken);
  if (newAccessToken) {
    store.dispatch(setToken(newAccessToken));
  }

  return newAccessToken || null;
};

instance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const requestToken = getAuthorizationTokenFromHeaders(config.headers);
    const token =
      requestToken || normalizeAuthToken(store.getState()?.role?.userAuthToken);
    const lang = store.getState().role.languageSelect;
    store.dispatch(showLoader('loading'));
    config.headers.set('x-app-language', lang);
    if (token) {
      (config.headers as AxiosRequestHeaders).Authorization = `Bearer ${token}`;
    } else if (typeof (config.headers as any).delete === 'function') {
      (config.headers as any).delete('Authorization');
    } else {
      delete (config.headers as Record<string, unknown>).Authorization;
      delete (config.headers as Record<string, unknown>).authorization;
    }

    return config;
  },
  error => {
    store.dispatch(hideLoader('idle'));
    return Promise.reject(error);
  },
);

export interface ApiError extends Error {
  status?: number;
  data?: unknown;
}

/**
 * Server har error ek jaisa nahi bhejta (kabhi `message`, kabhi `error`, kabhi
 * validation `errors` array, aur unknown route par HTML). Pehle jo mile wahi
 * message banate hain; kuch na mile to kam se kam status code dikha dete hain
 * taake "Something went wrong" par debugging na atke.
 */
const buildApiError = (error: any): ApiError => {
  const status: number | undefined = error?.response?.status;
  const data = error?.response?.data;

  const validationMessage =
    Array.isArray(data?.errors) && data.errors.length
      ? data.errors[0]?.message || data.errors[0]?.msg
      : undefined;

  const message =
    (typeof data?.message === 'string' && data.message) ||
    (typeof data?.error === 'string' && data.error) ||
    validationMessage ||
    (status
      ? `Request failed with status ${status}.`
      : error?.message || 'Something went wrong. Please try again.');

  const apiError: ApiError = new Error(message);
  apiError.status = status;
  apiError.data = data;

  return apiError;
};

instance.interceptors.response.use(
  (response: AxiosResponse) => {
    store.dispatch(hideLoader('idle'));

    return response;
  },
  error => {
    store.dispatch(hideLoader('idle'));
    const status = error?.response?.status;
    const originalRequest = error?.config as AxiosRequestConfig & {
      _retry?: boolean;
    };

    if (
      (status === 401 || status === 403) &&
      originalRequest &&
      !originalRequest._retry &&
      !originalRequest.url?.includes('auth/refresh')
    ) {
      originalRequest._retry = true;

      if (!isRefreshing) {
        isRefreshing = true;
        refreshAccessToken()
          .then(token => {
            isRefreshing = false;
            notifyTokenRefresh(token);
          })
          .catch(() => {
            isRefreshing = false;
            notifyTokenRefresh(null);
          });
      }

      return new Promise((resolve, reject) => {
        subscribeTokenRefresh(token => {
          const accessToken = normalizeAuthToken(token);

          if (!accessToken) {
            reject(buildApiError(error));
            return;
          }

          if (originalRequest.headers) {
            (
              originalRequest.headers as AxiosRequestHeaders
            ).Authorization = `Bearer ${accessToken}`;
          } else {
            originalRequest.headers = {
              Authorization: `Bearer ${accessToken}`,
            };
          }

          resolve(instance.request(originalRequest));
        });
      });
    }

    return Promise.reject(buildApiError(error));
  },
);

export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';

type ApiRequestConfig = Omit<
  AxiosRequestConfig,
  'method' | 'url' | 'headers' | 'data'
>;

export interface ApiResponse<T = any> {
  error: string | null;
  response: AxiosResponse<T> | null;
}

export const apiHelper = async <T = any>(
  method: HttpMethod,
  endPoint: string,
  customHeaders: Record<string, string> = {},
  body: any = null,
  requestConfig: ApiRequestConfig = {},
): Promise<ApiResponse<T>> => {
  try {
    const isFormData =
      typeof FormData !== 'undefined' && body instanceof FormData;

    const headers: Record<string, string> = isFormData
      ? { 'Content-Type': 'multipart/form-data', ...customHeaders }
      : { 'Content-Type': 'application/json', ...customHeaders };

    const config: AxiosRequestConfig = {
      method,
      url: endPoint,
      headers,
      ...(method !== 'GET' && body != null && { data: body }),
      ...(isFormData && { timeout: 60000 }),
      ...requestConfig,
    };

    const response = await instance.request<T>(config);

    return {
      error: null,
      response,
    };
  } catch (error: any) {
    return {
      error: error,
      response: null,
    };
  }
};

const normalizeApiError = (error: unknown) => {
  if (error instanceof Error) {
    return error;
  }

  if (typeof error === 'string') {
    return new Error(error);
  }

  return new Error('Something went wrong. Please try again.');
};

export interface ApiRequestPayload<TBody = unknown> {
  method: HttpMethod;
  endPoint: string;
  customHeaders?: Record<string, string>;
  body?: TBody;
  requestConfig?: ApiRequestConfig;
}

export const queryApiHelper = async <T = any, TBody = unknown>({
  method,
  endPoint,
  customHeaders = {},
  body,
  requestConfig = {},
}: ApiRequestPayload<TBody>): Promise<T> => {
  const { response, error } = await apiHelper<T>(
    method,
    endPoint,
    customHeaders,
    body ?? null,
    requestConfig,
  );

  if (error || !response) {
    throw normalizeApiError(error);
  }

  return response.data;
};

interface ApiQueryPayload<TBody = unknown>
  extends Omit<ApiRequestPayload<TBody>, 'method'> {
  method?: HttpMethod;
}

type ApiQueryOptions<TData, TError, TSelect> = Omit<
  UseQueryOptions<TData, TError, TSelect, QueryKey>,
  'queryFn' | 'queryKey'
>;

export const useApiQuery = <
  TData = any,
  TBody = unknown,
  TError = Error,
  TSelect = TData,
>(
  queryKey: QueryKey,
  apiPayload: ApiQueryPayload<TBody>,
  options?: ApiQueryOptions<TData, TError, TSelect>,
) =>
  useQuery<TData, TError, TSelect, QueryKey>({
    queryKey,
    queryFn: ({ signal }) =>
      queryApiHelper<TData, TBody>({
        method: apiPayload.method || 'GET',
        endPoint: apiPayload.endPoint,
        customHeaders: apiPayload.customHeaders,
        body: apiPayload.body,
        requestConfig: {
          ...apiPayload.requestConfig,
          signal,
        },
      }),
    ...options,
  });

export interface ApiMutationVariables<TBody = unknown> {
  method?: HttpMethod;
  endPoint?: string;
  customHeaders?: Record<string, string>;
  body?: TBody;
  requestConfig?: ApiRequestConfig;
}

interface UseApiMutationPayload {
  method?: HttpMethod;
  endPoint: string;
  customHeaders?: Record<string, string>;
  requestConfig?: ApiRequestConfig;
}

type ApiMutationOptions<TData, TError, TBody, TContext> = Omit<
  UseMutationOptions<TData, TError, ApiMutationVariables<TBody>, TContext>,
  'mutationFn'
>;

export const useApiMutation = <
  TData = any,
  TBody = unknown,
  TError = Error,
  TContext = unknown,
>(
  apiPayload: UseApiMutationPayload,
  options?: ApiMutationOptions<TData, TError, TBody, TContext>,
) =>
  useMutation<TData, TError, ApiMutationVariables<TBody>, TContext>({
    mutationFn: (variables = {}) => {
      return queryApiHelper<TData, TBody>({
        method: variables.method || apiPayload.method || 'POST',
        endPoint: variables.endPoint || apiPayload.endPoint,
        customHeaders: {
          ...apiPayload.customHeaders,
          ...variables.customHeaders,
        },
        body: variables.body,
        requestConfig: {
          ...apiPayload.requestConfig,
          ...variables.requestConfig,
        },
      });
    },
    ...options,
  });
