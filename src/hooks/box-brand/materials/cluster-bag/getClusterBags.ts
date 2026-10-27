/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { useQuery } from '@tanstack/react-query';
import { AxiosResponse } from 'axios';
import axios from '@/lib/axios';
import { serializeQueryResult } from '@/utils/serializeQueryResult';

function listClusterBags(): Promise<AxiosResponse> {
  return axios.get('/box-brand/cluster-bag');
}

export function useClusterBags() {
  const result = useQuery({
    queryKey: ['clusterBags'],
    queryFn: () => listClusterBags(),
  });

  return serializeQueryResult(result);
}
