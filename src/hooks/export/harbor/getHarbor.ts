import {
  keepPreviousData,
  UseQueryResult,
  useQuery,
} from '@tanstack/react-query';
import { AxiosResponse } from 'axios';
import axios from '@/lib/axios';
import { QueryConfig } from '@/lib/react-query';
import { HarborType } from '@/types/harbor';
import { serializeQueryResult } from '@/utils/serializeQueryResult';

export const getHarbor = ({
  harborId,
}: {
  harborId: string;
}): Promise<AxiosResponse> => {
  return axios.get(`/harbor/${harborId}`);
};

type QueryFnType = typeof getHarbor;

type UseHarborOptions = {
  harborId: string;
  config?: QueryConfig<QueryFnType>;
};

export const useHarbor = ({
  harborId,
}: UseHarborOptions): UseQueryResult<HarborType> => {
  const result = useQuery({
    queryKey: ['harbor', harborId],
    queryFn: () => getHarbor({ harborId }),
    placeholderData: keepPreviousData,
  });

  return serializeQueryResult(result) as UseQueryResult<HarborType>;
};
