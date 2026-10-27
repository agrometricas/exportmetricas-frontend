/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { useQuery } from '@tanstack/react-query';
import { AxiosResponse } from 'axios';
import axios from '@/lib/axios';
import { serializeQueryResult } from '@/utils/serializeQueryResult';

function listPackingTapes(): Promise<AxiosResponse> {
  return axios.get('/box-brand/packingtape');
}

export function usePackingTapes() {
  const result = useQuery({
    queryKey: ['packingtapes'],
    queryFn: () => listPackingTapes(),
  });
  return serializeQueryResult(result);
}
