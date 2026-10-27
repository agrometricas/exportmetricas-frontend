/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { useMutation } from '@tanstack/react-query';
import axios from '@/lib/axios';
import { MutationConfig } from '@/lib/react-query';
import { SealType } from '@/types/box-brand/container/seal';

interface CreateSealResponse {
  sealId: string;
}

export const createSeal = (
  data: Partial<SealType>
): Promise<CreateSealResponse> => {
  return axios.post('/box-brand/seal', data);
};

type UseCreateSealOptions = {
  config?: MutationConfig<typeof createSeal>;
};

export const useCreateSeal = ({ config }: UseCreateSealOptions = {}) => {
  const mutation = useMutation({
    ...config,
    mutationFn: createSeal,
  });

  return { ...mutation, createSeal: mutation.mutate };
};
