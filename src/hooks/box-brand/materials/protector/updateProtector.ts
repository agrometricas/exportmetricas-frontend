/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { useMutation } from '@tanstack/react-query';
import { AxiosResponse } from 'axios';
import axios from '@/lib/axios';
import { MutationConfig } from '@/lib/react-query';
import { ProtectorType } from '@/types/box-brand/materials/protector';

type updateProtectorDTO = {
  data: Partial<ProtectorType>;
  protectorId: string;
};

const updateProtector = ({
  data,
  protectorId,
}: updateProtectorDTO): Promise<AxiosResponse> => {
  return axios.post(`/box-brand/protector/${protectorId}`, data);
};

type UseUpdateProtectorOptions = {
  config?: MutationConfig<typeof updateProtector>;
};

export const useUpdateProtector = ({
  config,
}: UseUpdateProtectorOptions = {}) => {
  const mutation = useMutation({
    ...config,
    mutationFn: updateProtector,
  });

  return { ...mutation, updateProtector: mutation.mutateAsync };
};
