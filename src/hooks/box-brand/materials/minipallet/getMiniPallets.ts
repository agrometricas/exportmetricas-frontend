/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { useQuery } from '@tanstack/react-query';
import { AxiosResponse } from 'axios';
import axios from '@/lib/axios';
import { serializeQueryResult } from '@/utils/serializeQueryResult';

function listMiniPallets(): Promise<AxiosResponse> {
  return axios.get('/box-brand/minipallet');
}

export function useMiniPallets() {
  const result = useQuery({
    queryKey: ['minipallets'],
    queryFn: () => listMiniPallets(),
  });
  return serializeQueryResult(result);
}
