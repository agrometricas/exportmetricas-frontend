import {
  keepPreviousData,
  UseQueryResult,
  useQuery,
} from '@tanstack/react-query';
import { AxiosResponse } from 'axios';
import axios from '@/lib/axios';
import { QueryConfig } from '@/lib/react-query';
import { ClientType } from '@/types/client';
import { serializeQueryResult } from '@/utils/serializeQueryResult';

export const getClient = ({
  clientId,
}: {
  clientId: string;
}): Promise<AxiosResponse> => {
  return axios.get(`/client/${clientId}`);
};

type QueryFnType = typeof getClient;

type UseClientOptions = {
  clientId: string;
  config?: QueryConfig<QueryFnType>;
};

export const useClient = ({
  clientId,
}: UseClientOptions): UseQueryResult<ClientType> => {
  const result = useQuery({
    queryKey: ['client', clientId],
    queryFn: () => getClient({ clientId }),
    placeholderData: keepPreviousData,
  });

  return serializeQueryResult(result) as UseQueryResult<ClientType>;
};
