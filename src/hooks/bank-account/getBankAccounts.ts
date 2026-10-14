import { AxiosResponse } from 'axios';
import { useQuery } from 'react-query';
import axios from '@/lib/axios';
import { PaginationParams } from '@/types/paginationParams';
import { serializeQueryResult } from '@/utils/serializeQueryResult';

type Params = PaginationParams;

function listBankAccount(params: Params): Promise<AxiosResponse> {
  return axios.get('/bank-account', { params });
}

export function useBankAccounts({ search = '', page = 1, limit = 10 }: Params): ReturnType<typeof serializeQueryResult> {
  const result = useQuery(
    ['bankAccounts', search, page, limit],
    () => listBankAccount({ search, page, limit }),
    {
      keepPreviousData: true,
    }
  );

  return serializeQueryResult(result);
}
