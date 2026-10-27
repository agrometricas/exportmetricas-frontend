/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { useQuery } from '@tanstack/react-query';
import { AxiosResponse } from 'axios';
import axios from '@/lib/axios';
import { serializeQueryResult } from '@/utils/serializeQueryResult';

function listPallets(): Promise<AxiosResponse> {
  return axios.get('/box-brand/pallet');
}

export function usePallets() {
  const result = useQuery({
    queryKey: ['pallets'],
    queryFn: () => listPallets(),
  });
  return serializeQueryResult(result);
}
