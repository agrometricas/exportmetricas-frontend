/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { useMutation } from '@tanstack/react-query';
import { AxiosResponse } from 'axios';
import axios from '@/lib/axios';
import { MutationConfig } from '@/lib/react-query';
import { SachetType } from '@/types/box-brand/materials/sachet';

type updateSachetDTO = {
  data: Partial<SachetType>;
  sachetId: string;
};

const updateSachet = ({
  data,
  sachetId,
}: updateSachetDTO): Promise<AxiosResponse> => {
  return axios.post(`/box-brand/sachet/${sachetId}`, data);
};

type UseUpdateSachetOptions = {
  config?: MutationConfig<typeof updateSachet>;
};

export const useUpdateSachet = ({ config }: UseUpdateSachetOptions = {}) => {
  const mutation = useMutation({
    ...config,
    mutationFn: updateSachet,
  });

  return { ...mutation, updateSachet: mutation.mutateAsync };
};
