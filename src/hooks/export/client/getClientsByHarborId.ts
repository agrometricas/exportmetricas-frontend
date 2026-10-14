/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { AxiosResponse } from 'axios';
import { useQuery } from 'react-query';
import axios from '@/lib/axios';
import { PaginationParams } from '@/types/paginationParams';
import { serializeQueryResult } from '@/utils/serializeQueryResult';

type Params = PaginationParams;

interface Body {
  id: number;
}

function listClientsByHarborId(
  params: Params,
  body: Body
): Promise<AxiosResponse> {
  return axios.get(`/client/harbor/${body.id}`, { params });
}

export function useClientsByHarborId(
  { search = '', page = 1, limit = 10 }: Params,
  { id }: Body
) {
  const result = useQuery(
    ['clientsByHarbor', search, page, limit, id],
    () => listClientsByHarborId({ search, page, limit }, { id }),
    {
      keepPreviousData: true,
    }
  );

  return serializeQueryResult(result);
}
