import {
  keepPreviousData,
  useQuery,
  UseQueryResult,
} from '@tanstack/react-query';
import { AxiosResponse } from 'axios';
import axios from '@/lib/axios';
import { QueryConfig } from '@/lib/react-query';
import { PesticideType } from '@/types/box-brand/post-harvest/pesticide';
import { serializeQueryResult } from '@/utils/serializeQueryResult';

export const getPesticide = ({
  pesticideId,
}: {
  pesticideId: string;
}): Promise<AxiosResponse> => {
  return axios.get(`/box-brand/pesticide/${pesticideId}`);
};

type QueryFnType = typeof getPesticide;

type UsePesticideOptions = {
  pesticideId: string;
  config?: QueryConfig<QueryFnType>;
};

export const usePesticide = ({
  pesticideId,
}: UsePesticideOptions): UseQueryResult<PesticideType> => {
  const result = useQuery({
    queryKey: ['pesticide', pesticideId],
    queryFn: () => getPesticide({ pesticideId }),
    placeholderData: keepPreviousData,
  });

  return serializeQueryResult(result) as UseQueryResult<PesticideType>;
};
