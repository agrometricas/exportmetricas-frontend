/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { useQuery } from '@tanstack/react-query';
import { AxiosResponse } from 'axios';
import axios from '@/lib/axios';
import { serializeQueryResult } from '@/utils/serializeQueryResult';

function listBottoms(): Promise<AxiosResponse> {
  return axios.get('/box-brand/bottom');
}

export function useBottoms() {
  const result = useQuery({
    queryKey: ['bottoms'],
    queryFn: () => listBottoms(),
  });

  return serializeQueryResult(result);
}
