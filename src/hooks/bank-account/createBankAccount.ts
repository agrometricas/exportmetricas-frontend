import {
  useMutation,
  UseMutationOptions,
  UseMutationResult,
} from '@tanstack/react-query';
import { AxiosError } from 'axios';
import axios from '@/lib/axios';
import { BankAccountType } from '@/types/bankAccount';
import { ServerErrorResponse } from '../../types/errorResponse';

interface CreateBankAccountResponse {
  bankAccountId: string;
}

export const createBankAccount = (
  data: Partial<BankAccountType>
): Promise<CreateBankAccountResponse> => {
  return axios.post('/bank-account', data);
};

export const useCreateBankAccount = (
  config?: UseMutationOptions<
    CreateBankAccountResponse,
    AxiosError<ServerErrorResponse>,
    Partial<BankAccountType>
  >
): UseMutationResult<
  CreateBankAccountResponse,
  AxiosError<ServerErrorResponse>,
  Partial<BankAccountType>
> => {
  return useMutation({
    mutationFn: createBankAccount,
    ...config,
  });
};
