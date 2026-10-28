import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { AxiosResponse } from 'axios';
import axios from '@/lib/axios';
import { ShippingCompanyResponse } from '@/types/shippingCompany.response';
import { serializeQueryResult } from '@/utils/serializeQueryResult';

function listShippingCompany(): Promise<
  AxiosResponse<ShippingCompanyResponse[]>
> {
  return axios.get('/harbor/shipping-company');
}

export function useShippingCompanies(): UseQueryResult<
  ShippingCompanyResponse[],
  unknown
> {
  const result = useQuery({
    queryKey: ['shipping-companies'],
    queryFn: () => listShippingCompany(),
  });

  return serializeQueryResult(result);
}
