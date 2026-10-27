/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { useQuery } from '@tanstack/react-query';
import { AxiosResponse } from 'axios';
import axios from '@/lib/axios';
import { serializeQueryResult } from '@/utils/serializeQueryResult';

function listPesticides(): Promise<AxiosResponse> {
  return axios.get('/box-brand/pesticide');
}

export function usePesticides() {
  const result = useQuery({
    queryKey: ['pesticides'],
    queryFn: () => listPesticides(),
  });

  return serializeQueryResult(result);
}
