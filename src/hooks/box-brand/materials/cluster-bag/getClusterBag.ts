import {
  keepPreviousData,
  useQuery,
  UseQueryResult,
} from '@tanstack/react-query';
import { AxiosResponse } from 'axios';
import axios from '@/lib/axios';
import { QueryConfig } from '@/lib/react-query';
import { ClusterBagType } from '@/types/box-brand/materials/clusterBag';
import { serializeQueryResult } from '@/utils/serializeQueryResult';

export const getClusterBag = ({
  clusterBagId,
}: {
  clusterBagId: string;
}): Promise<AxiosResponse> => {
  return axios.get(`/box-brand/cluster-bag/${clusterBagId}`);
};

type QueryFnType = typeof getClusterBag;

type UseClusterBagOptions = {
  clusterBagId: string;
  config?: QueryConfig<QueryFnType>;
};

export const useClusterBag = ({
  clusterBagId,
}: UseClusterBagOptions): UseQueryResult<ClusterBagType> => {
  const result = useQuery({
    queryKey: ['clusterBag', clusterBagId],
    queryFn: () => getClusterBag({ clusterBagId }),
    placeholderData: keepPreviousData,
  });

  return serializeQueryResult(result) as UseQueryResult<ClusterBagType>;
};
