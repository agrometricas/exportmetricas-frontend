import {
  keepPreviousData,
  UseQueryResult,
  useQuery,
} from '@tanstack/react-query';
import { AxiosResponse } from 'axios';
import axios from '@/lib/axios';
import { QueryConfig } from '@/lib/react-query';
import { ShippingCompanyType } from '@/types/shippingCompany';
import { serializeQueryResult } from '@/utils/serializeQueryResult';

export const getShippingCompany = ({
  shippingCompanyId,
}: {
  shippingCompanyId: string;
}): Promise<AxiosResponse> => {
  return axios.get(`/harbor/shipping-company/${shippingCompanyId}`);
};

type QueryFnType = typeof getShippingCompany;

type UseShippingCompanyOptions = {
  shippingCompanyId: string;
  config?: QueryConfig<QueryFnType>;
};

export const useShippingCompany = ({
  shippingCompanyId,
}: UseShippingCompanyOptions): UseQueryResult<ShippingCompanyType> => {
  const result = useQuery({
    queryKey: ['shipping-company', shippingCompanyId],
    queryFn: () => getShippingCompany({ shippingCompanyId }),
    placeholderData: keepPreviousData,
  });

  return serializeQueryResult(result) as UseQueryResult<ShippingCompanyType>;
};
