/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { useQuery } from '@tanstack/react-query';
import { AxiosResponse } from 'axios';
import axios from '@/lib/axios';
import { serializeQueryResult } from '@/utils/serializeQueryResult';

function listMettoLabels(): Promise<AxiosResponse> {
  return axios.get('/box-brand/metto-label');
}

export function useMettoLabels() {
  const result = useQuery({
    queryKey: ['mettoLabels'],
    queryFn: () => listMettoLabels(),
  });

  return serializeQueryResult(result);
}
