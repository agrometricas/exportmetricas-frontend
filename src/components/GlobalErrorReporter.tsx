'use client';

import { useEffect } from 'react';
import { reportClientError } from '@/lib/error-reporter';

// Safety net for what no boundary and no catch sees: a throw outside React and
// a rejected promise nobody awaited.
export default function GlobalErrorReporter(): null {
  useEffect(() => {
    const onError = (event: ErrorEvent): void => {
      reportClientError('window-error', event.error ?? event.message);
    };
    const onRejection = (event: PromiseRejectionEvent): void => {
      reportClientError('unhandled-rejection', event.reason);
    };

    window.addEventListener('error', onError);
    window.addEventListener('unhandledrejection', onRejection);
    return () => {
      window.removeEventListener('error', onError);
      window.removeEventListener('unhandledrejection', onRejection);
    };
  }, []);

  return null;
}
