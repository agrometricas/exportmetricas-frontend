import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { AxiosResponse } from 'axios';
import axios from '@/lib/axios';
import { qk } from '@/lib/queryKeys';
import { ClusterBagType } from '@/types/box-brand/materials/clusterBag';
import { serializeQueryResult } from '@/utils/serializeQueryResult';

function listClusterBags(): Promise<AxiosResponse<ClusterBagType[]>> {
  return axios.get('/box-brand/cluster-bag');
}

export function useClusterBags(): UseQueryResult<ClusterBagType[], unknown> {
  const result = useQuery({
    queryKey: qk('clusterBags'),
    queryFn: () => listClusterBags(),
  });

  return serializeQueryResult(result);
}
