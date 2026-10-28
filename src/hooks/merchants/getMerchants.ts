import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { AxiosResponse } from 'axios';
import axios from '@/lib/axios';
import { MerchantResponse } from '@/types/merchant/merchant.response';
import { serializeQueryResult } from '@/utils/serializeQueryResult';

function listMerchants(): Promise<AxiosResponse<MerchantResponse[]>> {
  return axios.get<MerchantResponse[]>('/merchant');
}

export function useMerchants(): UseQueryResult<MerchantResponse[], unknown> {
  const result = useQuery({
    queryKey: ['merchants'],
    queryFn: () => listMerchants(),
  });

  return serializeQueryResult(result);
}
