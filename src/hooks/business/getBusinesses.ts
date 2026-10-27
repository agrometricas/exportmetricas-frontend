/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { AxiosResponse } from 'axios';
import axios from '@/lib/axios';
import { PaginationParams } from '@/types/paginationParams';
import { serializeQueryResult } from '@/utils/serializeQueryResult';

type Params = PaginationParams;

interface Body {
  id: number;
}

function listBusinesses(params: Params, body: Body): Promise<AxiosResponse> {
  return axios.get(`/merchant/${body.id}/business`, { params });
}

export function useBusinessesByMerchantId(
  { search = '', page = 1, limit = 10 }: Params,
  { id }: Body
) {
  const result = useQuery({
    queryKey: ['businesses', search, page, limit, id],
    queryFn: () => listBusinesses({ search, page, limit }, { id }),
    // Without a producer there are no farms to ask for.
    enabled: id > 0,
    placeholderData: keepPreviousData,
  });

  return serializeQueryResult(result);
}
