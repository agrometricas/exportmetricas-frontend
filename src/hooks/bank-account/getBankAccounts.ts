import { useQuery } from '@tanstack/react-query';
import { AxiosResponse } from 'axios';
import axios from '@/lib/axios';
import { serializeQueryResult } from '@/utils/serializeQueryResult';

function listBankAccount(): Promise<AxiosResponse> {
  return axios.get('/bank-account');
}

export function useBankAccounts(): ReturnType<typeof serializeQueryResult> {
  const result = useQuery({
    queryKey: ['bankAccounts'],
    queryFn: () => listBankAccount(),
  });

  return serializeQueryResult(result);
}
