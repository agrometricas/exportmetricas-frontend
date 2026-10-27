/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { useMutation } from '@tanstack/react-query';
import axios from '@/lib/axios';
import { MutationConfig } from '@/lib/react-query';
import { MiniPalletType } from '@/types/box-brand/materials/minipallet';

interface CreateMiniPalletResponse {
  miniPalletId: string;
}

export const createMiniPallet = (
  data: Partial<MiniPalletType>
): Promise<CreateMiniPalletResponse> => {
  return axios.post('/box-brand/minipallet', data);
};

type UseCreateMiniPalletOptions = {
  config?: MutationConfig<typeof createMiniPallet>;
};

export const useCreateMiniPallet = ({
  config,
}: UseCreateMiniPalletOptions = {}) => {
  const mutation = useMutation({
    ...config,
    mutationFn: createMiniPallet,
  });

  return { ...mutation, createMiniPallet: mutation.mutate };
};
