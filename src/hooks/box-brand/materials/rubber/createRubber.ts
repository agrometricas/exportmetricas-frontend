/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { useMutation } from '@tanstack/react-query';
import axios from '@/lib/axios';
import { MutationConfig } from '@/lib/react-query';
import { RubberType } from '@/types/box-brand/materials/rubber';

interface CreateRubberResponse {
  rubberId: string;
}

export const createRubber = (
  data: Partial<RubberType>
): Promise<CreateRubberResponse> => {
  return axios.post('/box-brand/rubber', data);
};

type UseCreateRubberOptions = {
  config?: MutationConfig<typeof createRubber>;
};

export const useCreateRubber = ({ config }: UseCreateRubberOptions = {}) => {
  const mutation = useMutation({
    ...config,
    mutationFn: createRubber,
  });

  return { ...mutation, createRubber: mutation.mutate };
};
