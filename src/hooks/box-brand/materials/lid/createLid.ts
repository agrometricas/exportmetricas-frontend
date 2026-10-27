/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { useMutation } from '@tanstack/react-query';
import axios from '@/lib/axios';
import { MutationConfig } from '@/lib/react-query';
import { LidType } from '@/types/box-brand/materials/lid';

interface CreateLidResponse {
  lidId: string;
}

export const createLid = (
  data: Partial<LidType>
): Promise<CreateLidResponse> => {
  return axios.post('/box-brand/lid', data);
};

type UseCreateLidOptions = {
  config?: MutationConfig<typeof createLid>;
};

export const useCreateLid = ({ config }: UseCreateLidOptions = {}) => {
  const mutation = useMutation({
    ...config,
    mutationFn: createLid,
  });

  return { ...mutation, createLid: mutation.mutate };
};
