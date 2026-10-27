/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { useQuery } from '@tanstack/react-query';
import { AxiosResponse } from 'axios';
import axios from '@/lib/axios';
import { serializeQueryResult } from '@/utils/serializeQueryResult';

function listBoxBrands(): Promise<AxiosResponse> {
  return axios.get('/box-brand');
}

export function useBoxBrands() {
  const result = useQuery({
    queryKey: ['boxBrands'],
    queryFn: () => listBoxBrands(),
  });

  return serializeQueryResult(result);
}
