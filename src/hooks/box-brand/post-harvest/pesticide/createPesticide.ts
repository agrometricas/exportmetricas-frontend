/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { useMutation } from '@tanstack/react-query';
import axios from '@/lib/axios';
import { MutationConfig } from '@/lib/react-query';
import { PesticideType } from '@/types/box-brand/post-harvest/pesticide';

interface CreatePesticideResponse {
  pesticideId: string;
}

export const createPesticide = (
  data: Partial<PesticideType>
): Promise<CreatePesticideResponse> => {
  return axios.post('/box-brand/pesticide', data);
};

type UseCreatePesticideOptions = {
  config?: MutationConfig<typeof createPesticide>;
};

export const useCreatePesticide = ({
  config,
}: UseCreatePesticideOptions = {}) => {
  const mutation = useMutation({
    ...config,
    mutationFn: createPesticide,
  });

  return { ...mutation, createPesticide: mutation.mutate };
};
