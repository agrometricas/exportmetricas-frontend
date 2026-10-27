/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { useMutation } from '@tanstack/react-query';
import axios from '@/lib/axios';
import { MutationConfig } from '@/lib/react-query';
import { SpongeType } from '@/types/box-brand/materials/sponge';

interface CreateSpongeResponse {
  spongeId: string;
}

export const createSponge = (
  data: Partial<SpongeType>
): Promise<CreateSpongeResponse> => {
  return axios.post('/box-brand/sponge', data);
};

type UseCreateSpongeOptions = {
  config?: MutationConfig<typeof createSponge>;
};

export const useCreateSponge = ({ config }: UseCreateSpongeOptions = {}) => {
  const mutation = useMutation({
    ...config,
    mutationFn: createSponge,
  });

  return { ...mutation, createSponge: mutation.mutate };
};
