/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { useMutation } from '@tanstack/react-query';
import axios from '@/lib/axios';
import { MutationConfig } from '@/lib/react-query';
import { CardboardType } from '@/types/box-brand/materials/cardboard';

interface CreateCardboardResponse {
  cardboardId: string;
}

export const createCardboard = (
  data: Partial<CardboardType>
): Promise<CreateCardboardResponse> => {
  return axios.post('/box-brand/cardboard', data);
};

type UseCreateCardboardOptions = {
  config?: MutationConfig<typeof createCardboard>;
};

export const useCreateCardboard = ({
  config,
}: UseCreateCardboardOptions = {}) => {
  const mutation = useMutation({
    ...config,
    mutationFn: createCardboard,
  });

  return { ...mutation, createCardboard: mutation.mutate };
};
