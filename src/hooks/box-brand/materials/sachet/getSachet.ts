import {
  keepPreviousData,
  useQuery,
  UseQueryResult,
} from '@tanstack/react-query';
import { AxiosResponse } from 'axios';
import axios from '@/lib/axios';
import { QueryConfig } from '@/lib/react-query';
import { SachetType } from '@/types/box-brand/materials/sachet';
import { serializeQueryResult } from '@/utils/serializeQueryResult';

export const getSachet = ({
  sachetId,
}: {
  sachetId: string;
}): Promise<AxiosResponse> => {
  return axios.get(`/box-brand/sachet/${sachetId}`);
};

type QueryFnType = typeof getSachet;

type UseSachetOptions = {
  sachetId: string;
  config?: QueryConfig<QueryFnType>;
};

export const useSachet = ({
  sachetId,
}: UseSachetOptions): UseQueryResult<SachetType> => {
  const result = useQuery({
    queryKey: ['sachet', sachetId],
    queryFn: () => getSachet({ sachetId }),
    placeholderData: keepPreviousData,
  });

  return serializeQueryResult(result) as UseQueryResult<SachetType>;
};
