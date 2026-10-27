import {
  keepPreviousData,
  useQuery,
  UseQueryResult,
} from '@tanstack/react-query';
import { AxiosResponse } from 'axios';
import axios from '@/lib/axios';
import { QueryConfig } from '@/lib/react-query';
import { InsecticideType } from '@/types/box-brand/additions/insecticide';
import { serializeQueryResult } from '@/utils/serializeQueryResult';

export const getInsecticide = ({
  InsecticideId,
}: {
  InsecticideId: string;
}): Promise<AxiosResponse> => {
  return axios.get(`/box-brand/Insecticide/${InsecticideId}`);
};

type QueryFnType = typeof getInsecticide;

type UseInsecticideOptions = {
  InsecticideId: string;
  config?: QueryConfig<QueryFnType>;
};

export const useInsecticide = ({
  InsecticideId,
}: UseInsecticideOptions): UseQueryResult<InsecticideType> => {
  const result = useQuery({
    queryKey: ['Insecticide', InsecticideId],
    queryFn: () => getInsecticide({ InsecticideId }),
    placeholderData: keepPreviousData,
  });

  return serializeQueryResult(result) as UseQueryResult<InsecticideType>;
};
