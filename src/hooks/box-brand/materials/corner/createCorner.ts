/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { useMutation } from '@tanstack/react-query';
import axios from '@/lib/axios';
import { MutationConfig } from '@/lib/react-query';
import { CornerType } from '@/types/box-brand/materials/corner';

interface CreateCornerResponse {
  cornerId: string;
}

export const createCorner = (
  data: Partial<CornerType>
): Promise<CreateCornerResponse> => {
  return axios.post('/box-brand/corner', data);
};

type UseCreateCornerOptions = {
  config?: MutationConfig<typeof createCorner>;
};

export const useCreateCorner = ({ config }: UseCreateCornerOptions = {}) => {
  const mutation = useMutation({
    ...config,
    mutationFn: createCorner,
  });

  return { ...mutation, createCorner: mutation.mutate };
};
