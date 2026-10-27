import {
  keepPreviousData,
  UseQueryResult,
  useQuery,
} from '@tanstack/react-query';
import { AxiosResponse } from 'axios';
import axios from '@/lib/axios';
import { QueryConfig } from '@/lib/react-query';
import { serializeQueryResult } from '@/utils/serializeQueryResult';
import { MerchantType } from '../../types/merchant/merchant';

export const getMerchant = ({
  merchantId,
}: {
  merchantId: string;
}): Promise<AxiosResponse> => {
  return axios.get(`/merchant/${merchantId}`);
};

type QueryFnType = typeof getMerchant;

type UseMerchantOptions = {
  merchantId: string;
  config?: QueryConfig<QueryFnType>;
};

export const useMerchant = ({
  merchantId,
}: UseMerchantOptions): UseQueryResult<MerchantType> => {
  const result = useQuery({
    queryKey: ['merchant', merchantId],
    queryFn: () => getMerchant({ merchantId }),
    placeholderData: keepPreviousData,
  });

  return serializeQueryResult(result) as UseQueryResult<MerchantType>;
};
