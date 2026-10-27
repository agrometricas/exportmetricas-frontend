/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { useQuery } from '@tanstack/react-query';
import { AxiosResponse } from 'axios';
import axios from '@/lib/axios';
import { serializeQueryResult } from '@/utils/serializeQueryResult';

function listStaples(): Promise<AxiosResponse> {
  return axios.get('/box-brand/staple');
}

export function useStaples() {
  const result = useQuery({
    queryKey: ['staples'],
    queryFn: () => listStaples(),
  });

  return serializeQueryResult(result);
}
