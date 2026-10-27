/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { useMutation } from '@tanstack/react-query';
import axios from '@/lib/axios';
import { MutationConfig } from '@/lib/react-query';
import { PackingTapeType } from '@/types/box-brand/materials/packingtape';

interface CreatePackingTapeResponse {
  packingTapeId: string;
}

export const createPackingTape = (
  data: Partial<PackingTapeType>
): Promise<CreatePackingTapeResponse> => {
  return axios.post('/box-brand/packingtape', data);
};

type UseCreatePackingTapeOptions = {
  config?: MutationConfig<typeof createPackingTape>;
};

export const useCreatePackingTape = ({
  config,
}: UseCreatePackingTapeOptions = {}) => {
  const mutation = useMutation({
    ...config,
    mutationFn: createPackingTape,
  });

  return { ...mutation, createPackingTape: mutation.mutate };
};
