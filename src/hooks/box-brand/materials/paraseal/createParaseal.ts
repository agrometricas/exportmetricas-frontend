/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { useMutation } from '@tanstack/react-query';
import axios from '@/lib/axios';
import { MutationConfig } from '@/lib/react-query';
import { ParasealType } from '@/types/box-brand/materials/paraseal';

interface CreateParasealResponse {
  parasealId: string;
}

export const createParaseal = (
  data: Partial<ParasealType>
): Promise<CreateParasealResponse> => {
  return axios.post('/box-brand/paraseal', data);
};

type UseCreateParasealOptions = {
  config?: MutationConfig<typeof createParaseal>;
};

export const useCreateParaseal = ({
  config,
}: UseCreateParasealOptions = {}) => {
  const mutation = useMutation({
    ...config,
    mutationFn: createParaseal,
  });

  return { ...mutation, createParaseal: mutation.mutate };
};
