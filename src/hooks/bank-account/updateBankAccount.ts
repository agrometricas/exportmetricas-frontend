import { useMutation } from '@tanstack/react-query';
import { AxiosResponse } from 'axios';
import axios from '@/lib/axios';
import { MutationConfig } from '@/lib/react-query';
import { BankAccountType } from '@/types/bankAccount';

type updateBankAccountDTO = {
  data: Partial<BankAccountType>;
  bankAccountId: string;
};

const updateBankAccount = ({
  data,
  bankAccountId,
}: updateBankAccountDTO): Promise<AxiosResponse> => {
  return axios.post(`/bank-account/${bankAccountId}`, data);
};

type UseUpdateBankAccountOptions = {
  config?: MutationConfig<typeof updateBankAccount>;
};

export const useUpdateBankAccount = ({
  config,
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/explicit-function-return-type
}: UseUpdateBankAccountOptions = {}) => {
  const mutation = useMutation({
    ...config,
    mutationFn: updateBankAccount,
  });

  return { ...mutation, updateBankAccount: mutation.mutateAsync };
};
