/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { useMutation } from '@tanstack/react-query';
import { AxiosResponse } from 'axios';
import axios from '@/lib/axios';
import { MutationConfig } from '@/lib/react-query';
import { ThermographType } from '@/types/box-brand/container/thermograph';

type updateThermographDTO = {
  data: Partial<ThermographType>;
  thermographId: string;
};

const updateThermograph = ({
  data,
  thermographId,
}: updateThermographDTO): Promise<AxiosResponse> => {
  return axios.post(`/box-brand/thermograph/${thermographId}`, data);
};

type UseUpdateThermographOptions = {
  config?: MutationConfig<typeof updateThermograph>;
};

export const useUpdateThermograph = ({
  config,
}: UseUpdateThermographOptions = {}) => {
  const mutation = useMutation({
    ...config,
    mutationFn: updateThermograph,
  });

  return { ...mutation, updateThermograph: mutation.mutateAsync };
};
