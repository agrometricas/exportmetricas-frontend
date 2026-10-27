import {
  keepPreviousData,
  useQuery,
  UseQueryResult,
} from '@tanstack/react-query';
import { AxiosResponse } from 'axios';
import axios from '@/lib/axios';
import { QueryConfig } from '@/lib/react-query';
import { SealType } from '@/types/box-brand/container/seal';
import { serializeQueryResult } from '@/utils/serializeQueryResult';

export const getSeal = ({
  sealId,
}: {
  sealId: string;
}): Promise<AxiosResponse> => {
  return axios.get(`/box-brand/seal/${sealId}`);
};

type QueryFnType = typeof getSeal;

type UseSealOptions = {
  sealId: string;
  config?: QueryConfig<QueryFnType>;
};

export const useSeal = ({
  sealId,
}: UseSealOptions): UseQueryResult<SealType> => {
  const result = useQuery({
    queryKey: ['seal', sealId],
    queryFn: () => getSeal({ sealId }),
    placeholderData: keepPreviousData,
  });

  return serializeQueryResult(result) as UseQueryResult<SealType>;
};
