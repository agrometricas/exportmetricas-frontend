import { useQuery } from '@tanstack/react-query';
import { AxiosResponse } from 'axios';
import axios from '@/lib/axios';
import { serializeQueryResult } from '@/utils/serializeQueryResult';
import { ClientResponse } from '../../../types/client.response';

function listClients(): Promise<AxiosResponse<ClientResponse[]>> {
  return axios.get<ClientResponse[]>('/client');
}

export function useClients(): ReturnType<typeof serializeQueryResult> {
  const result = useQuery({
    queryKey: ['clients'],
    queryFn: () => listClients(),
  });

  return serializeQueryResult(result);
}
