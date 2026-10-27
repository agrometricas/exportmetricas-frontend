/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { useMutation } from '@tanstack/react-query';
import axios from '@/lib/axios';
import { MutationConfig } from '@/lib/react-query';
import { PadType } from '@/types/box-brand/materials/pad';

interface CreatePadResponse {
  padId: string;
}

export const createPad = (
  data: Partial<PadType>
): Promise<CreatePadResponse> => {
  return axios.post('/box-brand/pad', data);
};

type UseCreatePadOptions = {
  config?: MutationConfig<typeof createPad>;
};

export const useCreatePad = ({ config }: UseCreatePadOptions = {}) => {
  const mutation = useMutation({
    ...config,
    mutationFn: createPad,
  });

  return { ...mutation, createPad: mutation.mutate };
};
