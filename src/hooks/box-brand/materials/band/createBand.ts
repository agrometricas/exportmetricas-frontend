/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { useMutation } from '@tanstack/react-query';
import axios from '@/lib/axios';
import { MutationConfig } from '@/lib/react-query';
import { BandType } from '@/types/box-brand/materials/band';

interface CreateBandResponse {
  bandId: string;
}

export const createBand = (
  data: Partial<BandType>
): Promise<CreateBandResponse> => {
  return axios.post('/box-brand/band', data);
};

type UseCreateBandOptions = {
  config?: MutationConfig<typeof createBand>;
};

export const useCreateBand = ({ config }: UseCreateBandOptions = {}) => {
  const mutation = useMutation({
    ...config,
    mutationFn: createBand,
  });

  return { ...mutation, createBand: mutation.mutate };
};
