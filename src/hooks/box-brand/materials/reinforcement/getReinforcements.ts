/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { useQuery } from '@tanstack/react-query';
import { AxiosResponse } from 'axios';
import axios from '@/lib/axios';
import { serializeQueryResult } from '@/utils/serializeQueryResult';

function listReinforcements(): Promise<AxiosResponse> {
  return axios.get('/box-brand/reinforcement');
}

export function useReinforcements() {
  const result = useQuery({
    queryKey: ['reinforcements'],
    queryFn: () => listReinforcements(),
  });
  return serializeQueryResult(result);
}
