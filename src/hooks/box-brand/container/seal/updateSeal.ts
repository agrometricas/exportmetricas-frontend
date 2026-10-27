/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { useMutation } from '@tanstack/react-query';
import { AxiosResponse } from 'axios';
import axios from '@/lib/axios';
import { MutationConfig } from '@/lib/react-query';
import { SealType } from '@/types/box-brand/container/seal';

type updateSealDTO = {
  data: Partial<SealType>;
  sealId: string;
};

const updateSeal = ({
  data,
  sealId,
}: updateSealDTO): Promise<AxiosResponse> => {
  return axios.post(`/box-brand/seal/${sealId}`, data);
};

type UseUpdateSealOptions = {
  config?: MutationConfig<typeof updateSeal>;
};

export const useUpdateSeal = ({ config }: UseUpdateSealOptions = {}) => {
  const mutation = useMutation({
    ...config,
    mutationFn: updateSeal,
  });

  return { ...mutation, updateSeal: mutation.mutateAsync };
};
