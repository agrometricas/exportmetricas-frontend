import { useQuery } from '@tanstack/react-query';
import { AxiosResponse } from 'axios';
import axios from '@/lib/axios';
import { serializeQueryResult } from '@/utils/serializeQueryResult';

function listShippingCompany(): Promise<AxiosResponse> {
  return axios.get('/harbor/shipping-company');
}

export function useShippingCompanies(): ReturnType<
  typeof serializeQueryResult
> {
  const result = useQuery({
    queryKey: ['shipping-companies'],
    queryFn: () => listShippingCompany(),
  });

  return serializeQueryResult(result);
}
