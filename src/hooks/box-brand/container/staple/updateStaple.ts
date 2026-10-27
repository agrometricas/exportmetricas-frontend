/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { useMutation } from '@tanstack/react-query';
import { AxiosResponse } from 'axios';
import axios from '@/lib/axios';
import { MutationConfig } from '@/lib/react-query';
import { StapleType } from '@/types/box-brand/container/staple';

type updateStapleDTO = {
  data: Partial<StapleType>;
  stapleId: string;
};

const updateStaple = ({
  data,
  stapleId,
}: updateStapleDTO): Promise<AxiosResponse> => {
  return axios.post(`/box-brand/staple/${stapleId}`, data);
};

type UseUpdateStapleOptions = {
  config?: MutationConfig<typeof updateStaple>;
};

export const useUpdateStaple = ({ config }: UseUpdateStapleOptions = {}) => {
  const mutation = useMutation({
    ...config,
    mutationFn: updateStaple,
  });

  return { ...mutation, updateStaple: mutation.mutateAsync };
};
