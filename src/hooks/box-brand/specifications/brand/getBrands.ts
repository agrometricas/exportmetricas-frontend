/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { useQuery } from '@tanstack/react-query';
import { AxiosResponse } from 'axios';
import axios from '@/lib/axios';
import { serializeQueryResult } from '@/utils/serializeQueryResult';

function listBrands(): Promise<AxiosResponse> {
  return axios.get('/box-brand/brand');
}

export function useBrands() {
  const result = useQuery({
    queryKey: ['brands'],
    queryFn: () => listBrands(),
  });

  return serializeQueryResult(result);
}
