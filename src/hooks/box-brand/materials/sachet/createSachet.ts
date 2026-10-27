/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { useMutation } from '@tanstack/react-query';
import axios from '@/lib/axios';
import { MutationConfig } from '@/lib/react-query';
import { SachetType } from '@/types/box-brand/materials/sachet';

interface CreateSachetResponse {
  sachetId: string;
}

export const createSachet = (
  data: Partial<SachetType>
): Promise<CreateSachetResponse> => {
  return axios.post('/box-brand/sachet', data);
};

type UseCreateSachetOptions = {
  config?: MutationConfig<typeof createSachet>;
};

export const useCreateSachet = ({ config }: UseCreateSachetOptions = {}) => {
  const mutation = useMutation({
    ...config,
    mutationFn: createSachet,
  });

  return { ...mutation, createSachet: mutation.mutate };
};
