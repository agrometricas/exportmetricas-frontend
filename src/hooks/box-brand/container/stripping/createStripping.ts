/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { useMutation } from '@tanstack/react-query';
import axios from '@/lib/axios';
import { MutationConfig } from '@/lib/react-query';
import { StrippingType } from '@/types/box-brand/container/stripping';

interface CreateStrippingResponse {
  strippingId: string;
}

export const createStripping = (
  data: Partial<StrippingType>
): Promise<CreateStrippingResponse> => {
  return axios.post('/box-brand/stripping', data);
};

type UseCreateStrippingOptions = {
  config?: MutationConfig<typeof createStripping>;
};

export const useCreateStripping = ({
  config,
}: UseCreateStrippingOptions = {}) => {
  const mutation = useMutation({
    ...config,
    mutationFn: createStripping,
  });

  return { ...mutation, createStripping: mutation.mutate };
};
