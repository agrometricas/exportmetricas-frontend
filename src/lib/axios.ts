import axios from 'axios';
import { getSession } from 'next-auth/react';
import { describeApiError } from './api-error-report';
import { env } from './env';
import { reportClientError } from './error-reporter';

const axiosInstance = axios.create({
  baseURL: `${env.NEXT_PUBLIC_API_URL}`,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

axiosInstance.interceptors.request.use(
  async (config) => {
    const session = await getSession();

    if (session) {
      config.headers.Authorization = `Bearer ${session.refreshToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    const report = describeApiError(error);
    if (report) {
      reportClientError(report.source, report.message, report.context);
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
