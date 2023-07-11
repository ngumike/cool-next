/* eslint-disable no-unused-vars */
import axios from 'axios';
import axiosRetry from 'axios-retry';
import { create } from 'apisauce';
import * as interceptors from './interceptors';
import authConfig from 'src/configs/auth';

/**
 * Web api confgiration
 */
export const webApi = ({ auth, req, res, asset } = {}) => {
  const baseApi = axios.create({
    baseURL: asset ? '' : process.env.NEXT_PUBLIC_API_BASE_URL,
    responseType: asset ? 'blob' : false,
    useAuth: auth,
    headers: {
      'Cache-Control': 'no-cache',
      'Content-Type': 'application/json'
    }
  });

  baseApi.interceptors.request.use(
    config => {
      const accessToken = globalThis.localStorage.getItem(authConfig.storageTokenKeyName);
      if (config.useAuth) {
        config.headers['Authorization'] = `Bearer ${accessToken}`;
      }
      config = interceptors.uploadRequest(baseApi, config);

      return config;
    },
    error => {
      return Promise.reject(error);
    }
  );

  baseApi.interceptors.response.use(
    res => {
      return res;
    },
    async err => {
      const originalConfig = err.config;

      if (originalConfig.url !== '/auth/refresh-token/' && err.response) {
        if (err.response.status === 401) {
          try {
            const oldRefreshToken = globalThis.localStorage.getItem(authConfig.onTokenExpiration);
            const { data } = await baseApi.post('/auth/refresh-token/', { refreshToken: oldRefreshToken });
            const { accessToken, refreshToken } = data.token;
            globalThis.localStorage.setItem(authConfig.storageTokenKeyName, accessToken);
            globalThis.localStorage.setItem(authConfig.onTokenExpiration, refreshToken);
          } catch (_error) {
            return _error;
          }
        }
      }

      return Promise.reject(err);
    }
  );

  axiosRetry(baseApi, { retryDelay: axiosRetry.exponentialDelay });

  return create({
    axiosInstance: baseApi,
    timeout: 20000
  });
};
