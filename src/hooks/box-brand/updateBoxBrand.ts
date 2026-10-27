/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { useMutation } from '@tanstack/react-query';
import { AxiosResponse } from 'axios';
import axios from '@/lib/axios';
import { MutationConfig } from '@/lib/react-query';
import { BoxBrandType } from '@/types/box-brand/boxBrand';

type updateBoxBrandDTO = {
  data: Partial<BoxBrandType>;
  boxBrandId: string;
};

const updateBoxBrand = ({
  data,
  boxBrandId,
}: updateBoxBrandDTO): Promise<AxiosResponse> => {
  return axios.post(`/box-brand/${boxBrandId}`, data);
};

type UseUpdateBoxBrandOptions = {
  config?: MutationConfig<typeof updateBoxBrand>;
};

export const useUpdateBoxBrand = ({
  config,
}: UseUpdateBoxBrandOptions = {}) => {
  const mutation = useMutation({
    ...config,
    mutationFn: updateBoxBrand,
  });

  return { ...mutation, updateBoxBrand: mutation.mutateAsync };
};
