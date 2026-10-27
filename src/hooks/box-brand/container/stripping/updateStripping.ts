/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { useMutation } from '@tanstack/react-query';
import { AxiosResponse } from 'axios';
import axios from '@/lib/axios';
import { MutationConfig } from '@/lib/react-query';
import { StrippingType } from '@/types/box-brand/container/stripping';

type updateStrippingDTO = {
  data: Partial<StrippingType>;
  strippingId: string;
};

const updateStripping = ({
  data,
  strippingId,
}: updateStrippingDTO): Promise<AxiosResponse> => {
  return axios.post(`/box-brand/stripping/${strippingId}`, data);
};

type UseUpdateStrippingOptions = {
  config?: MutationConfig<typeof updateStripping>;
};

export const useUpdateStripping = ({
  config,
}: UseUpdateStrippingOptions = {}) => {
  const mutation = useMutation({
    ...config,
    mutationFn: updateStripping,
  });

  return { ...mutation, updateStripping: mutation.mutateAsync };
};
