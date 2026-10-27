import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { AxiosResponse } from 'axios';
import axios from '@/lib/axios';
import { PaginationParams } from '@/types/paginationParams';
import { serializeQueryResult } from '@/utils/serializeQueryResult';

type Params = PaginationParams;

function listShippingCompany(params: Params): Promise<AxiosResponse> {
  return axios.get('/harbor/shipping-company', { params });
}

export function useShippingCompanies({
  search = '',
  page = 1,
  limit = 10,
}: Params): ReturnType<typeof serializeQueryResult> {
  const result = useQuery({
    queryKey: ['shipping-companies', search, page, limit],
    queryFn: () => listShippingCompany({ search, page, limit }),
    placeholderData: keepPreviousData,
  });

  return serializeQueryResult(result);
}
