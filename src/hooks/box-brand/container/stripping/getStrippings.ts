/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { useQuery } from '@tanstack/react-query';
import { AxiosResponse } from 'axios';
import axios from '@/lib/axios';
import { serializeQueryResult } from '@/utils/serializeQueryResult';

function listStrippings(): Promise<AxiosResponse> {
  return axios.get('/box-brand/stripping');
}

export function useStrippings() {
  const result = useQuery({
    queryKey: ['strippings'],
    queryFn: () => listStrippings(),
  });

  return serializeQueryResult(result);
}
