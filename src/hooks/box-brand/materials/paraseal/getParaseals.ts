/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { useQuery } from '@tanstack/react-query';
import { AxiosResponse } from 'axios';
import axios from '@/lib/axios';
import { serializeQueryResult } from '@/utils/serializeQueryResult';

function listParaseals(): Promise<AxiosResponse> {
  return axios.get('/box-brand/paraseal');
}

export function useParaseals() {
  const result = useQuery({
    queryKey: ['paraseals'],
    queryFn: () => listParaseals(),
  });
  return serializeQueryResult(result);
}
