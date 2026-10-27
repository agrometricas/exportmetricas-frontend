/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { useQuery } from '@tanstack/react-query';
import { AxiosResponse } from 'axios';
import axios from '@/lib/axios';
import { serializeQueryResult } from '@/utils/serializeQueryResult';

function listSachets(): Promise<AxiosResponse> {
  return axios.get('/box-brand/sachet');
}

export function useSachets() {
  const result = useQuery({
    queryKey: ['sachets'],
    queryFn: () => listSachets(),
  });

  return serializeQueryResult(result);
}
