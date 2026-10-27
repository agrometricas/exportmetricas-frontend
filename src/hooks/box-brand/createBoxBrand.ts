/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { useMutation } from '@tanstack/react-query';
import axios from '@/lib/axios';
import { MutationConfig } from '@/lib/react-query';
import { BoxBrandType } from '@/types/box-brand/boxBrand';

interface CreateBoxBrandResponse {
  brandId: string;
}

export const createBoxBrand = (
  data: Partial<BoxBrandType>
): Promise<CreateBoxBrandResponse> => {
  return axios.post('/box-brand', data);
};

type UseCreateBoxBrandOptions = {
  config?: MutationConfig<typeof createBoxBrand>;
};

export const useCreateBoxBrand = ({
  config,
}: UseCreateBoxBrandOptions = {}) => {
  const mutation = useMutation({
    ...config,
    mutationFn: createBoxBrand,
  });

  return { ...mutation, createBoxBrand: mutation.mutate };
};
