import {
  keepPreviousData,
  useQuery,
  UseQueryResult,
} from '@tanstack/react-query';
import { AxiosResponse } from 'axios';
import axios from '@/lib/axios';
import { qk } from '@/lib/queryKeys';
import { ClientResponse } from '@/types/client.response';
import { serializeQueryResult } from '@/utils/serializeQueryResult';

interface Body {
  id: number;
}

function listClientsByHarborId(
  body: Body
): Promise<AxiosResponse<ClientResponse[]>> {
  return axios.get(`/client/harbor/${body.id}`);
}

export function useClientsByHarborId({
  id,
}: Body): UseQueryResult<ClientResponse[], unknown> {
  const result = useQuery({
    queryKey: qk('clientsByHarbor', id),
    queryFn: () => listClientsByHarborId({ id }),
    placeholderData: keepPreviousData,
  });

  return serializeQueryResult(result);
}
