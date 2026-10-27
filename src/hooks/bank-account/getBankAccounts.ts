import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { AxiosResponse } from 'axios';
import axios from '@/lib/axios';
import { PaginationParams } from '@/types/paginationParams';
import { serializeQueryResult } from '@/utils/serializeQueryResult';

type Params = PaginationParams;

function listBankAccount(params: Params): Promise<AxiosResponse> {
  return axios.get('/bank-account', { params });
}

export function useBankAccounts({ search = '', page = 1, limit = 10 }: Params): ReturnType<typeof serializeQueryResult> {
  const result = useQuery({
    queryKey: ['bankAccounts', search, page, limit],
    queryFn: () => listBankAccount({ search, page, limit }),
    placeholderData: keepPreviousData
  });

  return serializeQueryResult(result);
}
