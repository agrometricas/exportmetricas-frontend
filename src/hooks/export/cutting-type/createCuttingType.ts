/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { useMutation } from '@tanstack/react-query';
import axios from '@/lib/axios';
import { MutationConfig } from '@/lib/react-query';
import { CuttingType } from '../../../types/cuttingType';

interface CreateCuttingTypeResponse {
  cuttingTypeId: string;
}

export const createCuttingType = (
  data: Partial<CuttingType>
): Promise<CreateCuttingTypeResponse> => {
  return axios.post('/cutting-type', data);
};

type UseCreateCuttingTypeOptions = {
  config?: MutationConfig<typeof createCuttingType>;
};

export const useCreateCuttingType = ({
  config,
}: UseCreateCuttingTypeOptions = {}) => {
  const mutation = useMutation({
    ...config,
    mutationFn: createCuttingType,
  });

  return { ...mutation, createCuttingType: mutation.mutate };
};
