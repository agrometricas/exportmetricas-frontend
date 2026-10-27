/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { useQuery } from '@tanstack/react-query';
import { AxiosResponse } from 'axios';
import axios from '@/lib/axios';
import { serializeQueryResult } from '@/utils/serializeQueryResult';

function listSeals(): Promise<AxiosResponse> {
  return axios.get('/box-brand/seal');
}

export function useSeals() {
  const result = useQuery({
    queryKey: ['seals'],
    queryFn: () => listSeals(),
  });

  return serializeQueryResult(result);
}
