/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { useMutation } from '@tanstack/react-query';
import axios from '@/lib/axios';
import { MutationConfig } from '@/lib/react-query';
import { BottomType } from '../../../../types/box-brand/materials/bottom';

interface CreateBottomResponse {
  bottomId: string;
}

export const createBottom = (
  data: Partial<BottomType>
): Promise<CreateBottomResponse> => {
  return axios.post('/box-brand/bottom', data);
};

type UseCreateBottomOptions = {
  config?: MutationConfig<typeof createBottom>;
};

export const useCreateBottom = ({ config }: UseCreateBottomOptions = {}) => {
  const mutation = useMutation({
    ...config,
    mutationFn: createBottom,
  });

  return { ...mutation, createBottom: mutation.mutate };
};
