import {
  keepPreviousData,
  useQuery,
  UseQueryResult,
} from '@tanstack/react-query';
import { AxiosResponse } from 'axios';
import axios from '@/lib/axios';
import { BusinessType } from '@/types/merchant/business';
import { serializeQueryResult } from '@/utils/serializeQueryResult';

interface Body {
  id: number;
}

function listBusinesses(body: Body): Promise<AxiosResponse<BusinessType[]>> {
  return axios.get(`/merchant/${body.id}/business`);
}

export function useBusinessesByMerchantId({
  id,
}: Body): UseQueryResult<BusinessType[], unknown> {
  const result = useQuery({
    queryKey: ['businesses', id],
    queryFn: () => listBusinesses({ id }),
    // Without a producer there are no farms to ask for.
    enabled: id > 0,
    placeholderData: keepPreviousData,
  });

  return serializeQueryResult(result);
}
