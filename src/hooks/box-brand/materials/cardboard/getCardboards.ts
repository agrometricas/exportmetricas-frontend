/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { useQuery } from '@tanstack/react-query';
import { AxiosResponse } from 'axios';
import axios from '@/lib/axios';
import { serializeQueryResult } from '@/utils/serializeQueryResult';

function listCardboards(): Promise<AxiosResponse> {
  return axios.get('/box-brand/cardboard');
}

export function useCardboards() {
  const result = useQuery({
    queryKey: ['cardboards'],
    queryFn: () => listCardboards(),
  });
  return serializeQueryResult(result);
}
