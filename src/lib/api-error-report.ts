import { isCancel } from 'axios';

export interface ApiErrorReport {
  source: 'api-5xx' | 'api-network' | 'api-contract-mismatch';
  message: string;
  context: {
    method: string;
    apiPath: string;
    status: number | null;
    backendMessage?: string;
  };
}

interface FailedRequest {
  code?: string;
  message?: string;
  config?: { method?: string; url?: string };
  response?: {
    status?: number;
    data?: { message?: unknown; errors?: unknown };
  };
}

// `forbidNonWhitelisted` on the backend: this web sent a field the deployed
// backend does not know yet.
const NOT_IN_DTO = 'should not exist';

function detail(value: unknown): string {
  if (value === undefined || value === null) return '';
  if (typeof value === 'string') return value;
  try {
    return JSON.stringify(value);
  } catch {
    return '';
  }
}

// Decides which failed requests are worth a line in the logs. An expected 4xx
// (session expired, not found, validation) is normal operation and is not.
export function describeApiError(error: unknown): ApiErrorReport | null {
  const failed = (error ?? {}) as FailedRequest;
  if (isCancel(error) || failed.code === 'ERR_CANCELED') return null;

  const status = failed.response?.status;
  const data = failed.response?.data;
  const isContractMismatch =
    status === 400 && detail(data?.errors).includes(NOT_IN_DTO);
  if (status !== undefined && status < 500 && !isContractMismatch) return null;

  const backendMessage = detail(
    isContractMismatch ? data?.errors : data?.message
  ).slice(0, 300);

  return {
    source: isContractMismatch
      ? 'api-contract-mismatch'
      : status !== undefined
        ? 'api-5xx'
        : 'api-network',
    message: failed.message ?? 'request failed',
    context: {
      method: failed.config?.method?.toUpperCase() ?? '?',
      // Without the query string: a public link carries its token there.
      apiPath: String(failed.config?.url ?? '?').split('?')[0],
      status: status ?? null,
      ...(backendMessage && { backendMessage }),
    },
  };
}
