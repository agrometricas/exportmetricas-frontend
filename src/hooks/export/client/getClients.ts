import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { AxiosResponse } from 'axios';
import axios from '@/lib/axios';
import { PaginationParams } from '@/types/paginationParams';
import { serializeQueryResult } from '@/utils/serializeQueryResult';
import { ClientResponse } from '../../../types/client.response';

type Params = PaginationParams;

function listClients(params: Params): Promise<AxiosResponse<ClientResponse[]>> {
  return axios.get<ClientResponse[]>('/client', { params });
}

export function useClients({ search = '', page = 1, limit = 10 }: Params): ReturnType<typeof serializeQueryResult> {
  const result = useQuery({
    queryKey: ['clients', search, page, limit],
    queryFn: () => listClients({ search, page, limit }),
    placeholderData: keepPreviousData
  });

  return serializeQueryResult(result);
}
