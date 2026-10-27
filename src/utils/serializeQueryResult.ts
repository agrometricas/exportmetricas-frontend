/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { UseQueryResult } from '@tanstack/react-query';
import { AxiosResponse } from 'axios';

export function serializeQueryResult(
  result: UseQueryResult<AxiosResponse<any, any> | any, unknown>
): UseQueryResult<any, unknown> {
  return { ...result, data: result.data?.data } as UseQueryResult<any, unknown>;
}
