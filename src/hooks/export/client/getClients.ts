import { AxiosResponse } from 'axios';
import { useQuery } from 'react-query';
import axios from '@/lib/axios';
import { PaginationParams } from '@/types/paginationParams';
import { serializeQueryResult } from '@/utils/serializeQueryResult';
import { ClientResponse } from '../../../types/client.response';

type Params = PaginationParams;

function listClients(params: Params): Promise<AxiosResponse<ClientResponse[]>> {
  return axios.get<ClientResponse[]>('/client', { params });
}

export function useClients({ search = '', page = 1, limit = 10 }: Params): ReturnType<typeof serializeQueryResult> {
  const result = useQuery<AxiosResponse<ClientResponse[]>>(
    ['clients', search, page, limit],
    () => listClients({ search, page, limit }),
    {
      keepPreviousData: true,
    }
  );

  return serializeQueryResult(result);
}
