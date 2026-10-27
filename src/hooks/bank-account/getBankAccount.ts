import {
  keepPreviousData,
  UseQueryResult,
  useQuery,
} from '@tanstack/react-query';
import { AxiosResponse } from 'axios';
import axios from '@/lib/axios';
import { QueryConfig } from '@/lib/react-query';
import { BankAccountType } from '@/types/bankAccount';
import { serializeQueryResult } from '@/utils/serializeQueryResult';

export const getBankAccount = ({
  bankAccountId,
}: {
  bankAccountId: string;
}): Promise<AxiosResponse> => {
  return axios.get(`/bank-account/${bankAccountId}`);
};

type QueryFnType = typeof getBankAccount;

type UseBankAccountOptions = {
  bankAccountId: string;
  config?: QueryConfig<QueryFnType>;
};

export const useBankAccount = ({
  bankAccountId,
}: UseBankAccountOptions): UseQueryResult<BankAccountType> => {
  const result = useQuery({
    queryKey: ['bankAccount', bankAccountId],
    queryFn: () => getBankAccount({ bankAccountId }),
    placeholderData: keepPreviousData,
  });

  return serializeQueryResult(result) as UseQueryResult<BankAccountType>;
};
