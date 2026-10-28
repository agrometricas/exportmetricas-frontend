import { UseQueryResult } from '@tanstack/react-query';
import { AxiosResponse } from 'axios';

export function serializeQueryResult<T>(
  result: UseQueryResult<AxiosResponse<T>, unknown>
): UseQueryResult<T, unknown> {
  return { ...result, data: result.data?.data } as UseQueryResult<T, unknown>;
}
