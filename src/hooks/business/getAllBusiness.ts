import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { AxiosResponse } from 'axios';
import axios from '../../lib/axios';
import { BusinessResponse } from '../../types/merchant/merchant.response';
import { PaginationParams } from '../../types/paginationParams';
import { serializeQueryResult } from '../../utils/serializeQueryResult';

type Params = PaginationParams;

function listBusinesses(params: Params): Promise<AxiosResponse<BusinessResponse[]>> {
  return axios.get('/merchant/business', { params });
}

export function useBusinesses({ search = '', page = 1, limit = 10 }: Params): ReturnType<typeof serializeQueryResult> {
  const result = useQuery({
    queryKey: ['businesses', search, page, limit],
    queryFn: () => listBusinesses({ search, page, limit }),
    placeholderData: keepPreviousData
  });

  return serializeQueryResult(result);
}
