/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { useMutation } from '@tanstack/react-query';
import { AxiosResponse } from 'axios';
import axios from '@/lib/axios';
import { MutationConfig } from '@/lib/react-query';
import { LabelType } from '@/types/box-brand/materials/label';

type updateLabelDTO = {
  data: Partial<LabelType>;
  labelId: string;
};

const updateLabel = ({
  data,
  labelId,
}: updateLabelDTO): Promise<AxiosResponse> => {
  return axios.post(`/box-brand/label/${labelId}`, data);
};

type UseUpdateLabelOptions = {
  config?: MutationConfig<typeof updateLabel>;
};

export const useUpdateLabel = ({ config }: UseUpdateLabelOptions = {}) => {
  const mutation = useMutation({
    ...config,
    mutationFn: updateLabel,
  });

  return { ...mutation, updateLabel: mutation.mutateAsync };
};
