/* eslint-disable @typescript-eslint/no-explicit-any */
import axios, { Method } from 'axios';
import qs from 'qs';

import SessionService from './SessionService';
import { StorageService } from './StorageService';
import { Navigation } from '@/constants';
import { Configuration } from '@/constants/Config';

axios.defaults.baseURL = Configuration.API_URL;
axios.defaults.headers.post['Content-Type'] = 'application/json';

export const AuthorizationKey = 'Authorization';
axios.defaults.headers.common[AuthorizationKey] = StorageService.authToken.getValue()
  ? `Bearer ${StorageService.authToken.getValue()}`
  : null;

export const setUserSessionToken = (token?: string | null) => {
  if (token) {
    axios.defaults.headers.common[AuthorizationKey] = `Bearer ${token}`;
  } else {
    delete axios.defaults.headers.common[AuthorizationKey];
  }
};

export const getHttpClient = (
  path: string,
  method: Method,
  data: any | undefined = undefined,
  params: any | undefined = undefined,
): Promise<any> => {
  const query = params ? '?' + qs.stringify(params, { allowDots: true }) : '';
  console.log('query', params);
  const urlPath = path + query;

  return asyncOperation(
    axios({
      method: method,
      url: urlPath,
      data: data,
    }),
  );
};

export const postMultiPart = async (
  path: string,
  method: string,
  data: any,
  params: any,
) => {
  const query = params !== null ? '?' + qs.stringify(params, { allowDots: true }) : '';

  const url = axios.defaults.baseURL + path + query;
  const rawResponse = await fetch(url, {
    method,
    body: data,
    headers: {
      'Content-Type': 'multipart/form-data',
      Authorization: axios.defaults.headers.common[AuthorizationKey],
    } as any,
  });
  const jsonData = await rawResponse.json();
  const status = jsonData?.status ?? jsonData?.code;
  const hasError = [500, 400, 404].includes(status);
  if (hasError) {
    const message = jsonData?.message;
    throw new ServerException(jsonData?.error ?? message, status, jsonData);
  }
  return jsonData;
};

const asyncOperation = async (request: Promise<any>) => {
  try {
    const response = await request;
    return response.data;
  } catch (error: any) {
    const data = error?.response?.data;

    const message = data?.message ?? data?.error;
    const status = data?.status ?? error?.response?.status;

    if (status === 401) {
      SessionService.unAuthenticated();
      StorageService.authToken.clear();
      window.location.href = Navigation.Login;
      throw new ServerException(message, status, data);
    } else if (message) {
      throw new ServerException(message, status, data);
    } else {
      throw error;
    }
  }
};

class ServerException extends Error {
  status: number;
  response: any;
  constructor(message: string, status: number, response: any | null) {
    super(message);
    this.name = 'ServerException';
    this.status = status;
    this.response = response;
  }
}

export { ServerException };
