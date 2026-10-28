import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { AxiosResponse } from 'axios';
import axios from '@/lib/axios';
import { BankAccountResponse } from '@/types/bankAccount.response';
import { serializeQueryResult } from '@/utils/serializeQueryResult';

function listBankAccount(): Promise<AxiosResponse<BankAccountResponse[]>> {
  return axios.get('/bank-account');
}

export function useBankAccounts(): UseQueryResult<
  BankAccountResponse[],
  unknown
> {
  const result = useQuery({
    queryKey: ['bankAccounts'],
    queryFn: () => listBankAccount(),
  });

  return serializeQueryResult(result);
}
