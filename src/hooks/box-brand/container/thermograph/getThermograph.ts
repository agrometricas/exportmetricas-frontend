import {
  keepPreviousData,
  useQuery,
  UseQueryResult,
} from '@tanstack/react-query';
import { AxiosResponse } from 'axios';
import axios from '@/lib/axios';
import { QueryConfig } from '@/lib/react-query';
import { ThermographType } from '@/types/box-brand/container/thermograph';
import { serializeQueryResult } from '@/utils/serializeQueryResult';

export const getThermograph = ({
  thermographId,
}: {
  thermographId: string;
}): Promise<AxiosResponse> => {
  return axios.get(`/box-brand/thermograph/${thermographId}`);
};

type QueryFnType = typeof getThermograph;

type UseThermographOptions = {
  thermographId: string;
  config?: QueryConfig<QueryFnType>;
};

export const useThermograph = ({
  thermographId,
}: UseThermographOptions): UseQueryResult<ThermographType> => {
  const result = useQuery({
    queryKey: ['thermograph', thermographId],
    queryFn: () => getThermograph({ thermographId }),
    placeholderData: keepPreviousData,
  });

  return serializeQueryResult(result) as UseQueryResult<ThermographType>;
};
