/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { useMutation } from '@tanstack/react-query';
import axios from '@/lib/axios';
import { MutationConfig } from '@/lib/react-query';
import { CoverType } from '@/types/box-brand/materials/cover';

interface CreateCoverResponse {
  coverId: string;
}

export const createCover = (
  data: Partial<CoverType>
): Promise<CreateCoverResponse> => {
  return axios.post('/box-brand/cover', data);
};

type UseCreateCoverOptions = {
  config?: MutationConfig<typeof createCover>;
};

export const useCreateCover = ({ config }: UseCreateCoverOptions = {}) => {
  const mutation = useMutation({
    ...config,
    mutationFn: createCover,
  });

  return { ...mutation, createCover: mutation.mutate };
};
