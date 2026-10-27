import axios from 'axios';
import { Session } from 'next-auth';
import { getSession, signOut } from 'next-auth/react';
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

// getSession() is a round trip to /api/auth/session; a screen that opens with
// ten requests would make ten. One answer serves a minute of requests: the
// token renews at half its life, so the one reused stays valid. No session is
// never kept, so the first request after signing in asks again.
const SESSION_REUSE_MS = 60_000;
let reusable: { session: Session; at: number } | null = null;
let asking: Promise<Session | null> | null = null;

function currentSession(): Promise<Session | null> {
  if (reusable && Date.now() - reusable.at < SESSION_REUSE_MS) {
    return Promise.resolve(reusable.session);
  }
  asking ??= getSession()
    .then((session) => {
      reusable = session ? { session, at: Date.now() } : null;
      return session;
    })
    .finally(() => {
      asking = null;
    });
  return asking;
}

axiosInstance.interceptors.request.use(
  async (config) => {
    const session = await currentSession();

    if (session) {
      config.headers.Authorization = `Bearer ${session.refreshToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

let signingOut = false;

// The backend only answers 401 when the session is no longer valid, so any of
// them ends it. The request never settles: the page is about to unload, and an
// error toast or error screen would flash first.
function endSession(): Promise<never> {
  if (!signingOut) {
    signingOut = true;
    const back = window.location.pathname + window.location.search;
    void signOut({
      callbackUrl: `/auth/signin?callbackUrl=${encodeURIComponent(back)}`,
    });
  }
  return new Promise(() => {});
}

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error?.response?.status === 401 && typeof window !== 'undefined') {
      return endSession();
    }
    const report = describeApiError(error);
    if (report) {
      reportClientError(report.source, report.message, report.context);
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
