/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { useMutation } from '@tanstack/react-query';
import axios from '@/lib/axios';
import { MutationConfig } from '@/lib/react-query';
import { PalletType } from '@/types/box-brand/materials/pallet';

interface CreatePalletResponse {
  palletId: string;
}

export const createPallet = (
  data: Partial<PalletType>
): Promise<CreatePalletResponse> => {
  return axios.post('/box-brand/pallet', data);
};

type UseCreatePalletOptions = {
  config?: MutationConfig<typeof createPallet>;
};

export const useCreatePallet = ({ config }: UseCreatePalletOptions = {}) => {
  const mutation = useMutation({
    ...config,
    mutationFn: createPallet,
  });

  return { ...mutation, createPallet: mutation.mutate };
};
