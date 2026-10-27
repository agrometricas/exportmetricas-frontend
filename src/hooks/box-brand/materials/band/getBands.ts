/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { useQuery } from '@tanstack/react-query';
import { AxiosResponse } from 'axios';
import axios from '@/lib/axios';
import { serializeQueryResult } from '@/utils/serializeQueryResult';

function listBands(): Promise<AxiosResponse> {
  return axios.get('/box-brand/band');
}

export function useBands() {
  const result = useQuery({
    queryKey: ['bands'],
    queryFn: () => listBands(),
  });

  return serializeQueryResult(result);
}
