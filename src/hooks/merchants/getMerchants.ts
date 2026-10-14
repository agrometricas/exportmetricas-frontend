import { AxiosResponse } from 'axios';
import { useQuery } from 'react-query';
import axios from '@/lib/axios';
import { MerchantResponse } from '@/types/merchant/merchant.response';
import { PaginationParams } from '@/types/paginationParams';
import { serializeQueryResult } from '@/utils/serializeQueryResult';

type Params = PaginationParams;

function listMerchants(params: Params): Promise<AxiosResponse<MerchantResponse[]>> {
  return axios.get<MerchantResponse[]>('/merchant', { params });
}

export function useMerchants({ search = '', page = 1, limit = 10 }: Params): ReturnType<typeof serializeQueryResult> {
  const result = useQuery<AxiosResponse<MerchantResponse[]>>(
    ['merchants', search, page, limit],
    () => listMerchants({ search, page, limit }),
    {
      keepPreviousData: true,
    }
  );

  return serializeQueryResult(result);
}
