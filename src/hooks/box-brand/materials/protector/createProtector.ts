/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { useMutation } from '@tanstack/react-query';
import axios from '@/lib/axios';
import { MutationConfig } from '@/lib/react-query';
import { ProtectorType } from '@/types/box-brand/materials/protector';

interface CreateProtectorResponse {
  protectorId: string;
}

export const createProtector = (
  data: Partial<ProtectorType>
): Promise<CreateProtectorResponse> => {
  return axios.post('/box-brand/protector', data);
};

type UseCreateProtectorOptions = {
  config?: MutationConfig<typeof createProtector>;
};

export const useCreateProtector = ({
  config,
}: UseCreateProtectorOptions = {}) => {
  const mutation = useMutation({
    ...config,
    mutationFn: createProtector,
  });

  return { ...mutation, createProtector: mutation.mutate };
};
