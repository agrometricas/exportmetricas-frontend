import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { AxiosResponse } from 'axios';
import axios from '@/lib/axios';
import { qk } from '@/lib/queryKeys';
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
    queryKey: qk('bankAccounts'),
    queryFn: () => listBankAccount(),
  });

  return serializeQueryResult(result);
}
