/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { AxiosResponse } from 'axios';
import axios from '@/lib/axios';
import { serializeQueryResult } from '@/utils/serializeQueryResult';

interface Body {
  id: number;
}

function listBusinesses(body: Body): Promise<AxiosResponse> {
  return axios.get(`/merchant/${body.id}/business`);
}

export function useBusinessesByMerchantId({ id }: Body) {
  const result = useQuery({
    queryKey: ['businesses', id],
    queryFn: () => listBusinesses({ id }),
    // Without a producer there are no farms to ask for.
    enabled: id > 0,
    placeholderData: keepPreviousData,
  });

  return serializeQueryResult(result);
}
