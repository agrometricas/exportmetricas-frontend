/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { useMutation } from '@tanstack/react-query';
import { AxiosResponse } from 'axios';
import axios from '@/lib/axios';
import { MutationConfig } from '@/lib/react-query';
import { BandType } from '@/types/box-brand/materials/band';

type updateBandDTO = {
  data: Partial<BandType>;
  bandId: string;
};

const updateBand = ({
  data,
  bandId,
}: updateBandDTO): Promise<AxiosResponse> => {
  return axios.post(`/box-brand/band/${bandId}`, data);
};

type UseUpdateBandOptions = {
  config?: MutationConfig<typeof updateBand>;
};

export const useUpdateBand = ({ config }: UseUpdateBandOptions = {}) => {
  const mutation = useMutation({
    ...config,
    mutationFn: updateBand,
  });

  return { ...mutation, updateBand: mutation.mutateAsync };
};
