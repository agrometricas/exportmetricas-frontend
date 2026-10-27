import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { AxiosResponse } from 'axios';
import axios from '@/lib/axios';
import { MerchantResponse } from '@/types/merchant/merchant.response';
import { PaginationParams } from '@/types/paginationParams';
import { serializeQueryResult } from '@/utils/serializeQueryResult';

type Params = PaginationParams;

function listMerchants(params: Params): Promise<AxiosResponse<MerchantResponse[]>> {
  return axios.get<MerchantResponse[]>('/merchant', { params });
}

export function useMerchants({ search = '', page = 1, limit = 10 }: Params): ReturnType<typeof serializeQueryResult> {
  const result = useQuery({
    queryKey: ['merchants', search, page, limit],
    queryFn: () => listMerchants({ search, page, limit }),
    placeholderData: keepPreviousData
  });

  return serializeQueryResult(result);
}
