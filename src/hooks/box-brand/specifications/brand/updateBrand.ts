/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { useMutation } from '@tanstack/react-query';
import { AxiosResponse } from 'axios';
import axios from '@/lib/axios';
import { MutationConfig } from '@/lib/react-query';
import { BrandType } from '../../../../types/box-brand/specifications/brand';

type updateBrandDTO = {
  data: Partial<BrandType>;
  brandId: string;
};

const updateBrand = ({
  data,
  brandId,
}: updateBrandDTO): Promise<AxiosResponse> => {
  return axios.post(`/box-brand/brand/${brandId}`, data);
};

type UseUpdateBrandOptions = {
  config?: MutationConfig<typeof updateBrand>;
};

export const useUpdateBrand = ({ config }: UseUpdateBrandOptions = {}) => {
  const mutation = useMutation({
    ...config,
    mutationFn: updateBrand,
  });

  return { ...mutation, updateBrand: mutation.mutateAsync };
};
