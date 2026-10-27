/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { useMutation } from '@tanstack/react-query';
import axios from '@/lib/axios';
import { MutationConfig } from '@/lib/react-query';
import { StapleType } from '@/types/box-brand/container/staple';

interface CreateStapleResponse {
  stapleId: string;
}

export const createStaple = (
  data: Partial<StapleType>
): Promise<CreateStapleResponse> => {
  return axios.post('/box-brand/staple', data);
};

type UseCreateStapleOptions = {
  config?: MutationConfig<typeof createStaple>;
};

export const useCreateStaple = ({ config }: UseCreateStapleOptions = {}) => {
  const mutation = useMutation({
    ...config,
    mutationFn: createStaple,
  });

  return { ...mutation, createStaple: mutation.mutate };
};
