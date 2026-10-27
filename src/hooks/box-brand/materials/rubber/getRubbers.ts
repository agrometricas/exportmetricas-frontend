/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { useQuery } from '@tanstack/react-query';
import { AxiosResponse } from 'axios';
import axios from '@/lib/axios';
import { serializeQueryResult } from '@/utils/serializeQueryResult';

function listRubbers(): Promise<AxiosResponse> {
  return axios.get('/box-brand/rubber');
}

export function useRubbers() {
  const result = useQuery({
    queryKey: ['rubbers'],
    queryFn: () => listRubbers(),
  });

  return serializeQueryResult(result);
}
