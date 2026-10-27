/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { useQuery } from '@tanstack/react-query';
import { AxiosResponse } from 'axios';
import axios from '@/lib/axios';
import { serializeQueryResult } from '@/utils/serializeQueryResult';

function listLids(): Promise<AxiosResponse> {
  return axios.get('/box-brand/lid');
}

export function useLids() {
  const result = useQuery({
    queryKey: ['lids'],
    queryFn: () => listLids(),
  });
  return serializeQueryResult(result);
}
