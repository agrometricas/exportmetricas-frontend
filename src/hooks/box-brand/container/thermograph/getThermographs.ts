/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { useQuery } from '@tanstack/react-query';
import { AxiosResponse } from 'axios';
import axios from '@/lib/axios';
import { serializeQueryResult } from '@/utils/serializeQueryResult';

function listThermographs(): Promise<AxiosResponse> {
  return axios.get('/box-brand/thermograph');
}

export function useThermographs() {
  const result = useQuery({
    queryKey: ['thermographs'],
    queryFn: () => listThermographs(),
  });

  return serializeQueryResult(result);
}
