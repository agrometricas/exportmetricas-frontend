import {
  keepPreviousData,
  useQuery,
  UseQueryResult,
} from '@tanstack/react-query';
import { AxiosResponse } from 'axios';
import axios from '@/lib/axios';
import { QueryConfig } from '@/lib/react-query';
import { ProtectorType } from '@/types/box-brand/materials/protector';
import { serializeQueryResult } from '@/utils/serializeQueryResult';

export const getProtector = ({
  protectorId,
}: {
  protectorId: string;
}): Promise<AxiosResponse> => {
  return axios.get(`/box-brand/protector/${protectorId}`);
};

type QueryFnType = typeof getProtector;

type UseProtectorOptions = {
  protectorId: string;
  config?: QueryConfig<QueryFnType>;
};

export const useProtector = ({
  protectorId,
}: UseProtectorOptions): UseQueryResult<ProtectorType> => {
  const result = useQuery({
    queryKey: ['protector', protectorId],
    queryFn: () => getProtector({ protectorId }),
    placeholderData: keepPreviousData,
  });

  return serializeQueryResult(result) as UseQueryResult<ProtectorType>;
};
