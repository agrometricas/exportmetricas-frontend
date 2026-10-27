/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { useMutation } from '@tanstack/react-query';
import { AxiosResponse } from 'axios';
import axios from '@/lib/axios';
import { MutationConfig } from '@/lib/react-query';
import { MettoLabelType } from '@/types/box-brand/container/mettoLabel';

type updateMettoLabelDTO = {
  data: Partial<MettoLabelType>;
  mettoLabelId: string;
};

const updateMettoLabel = ({
  data,
  mettoLabelId,
}: updateMettoLabelDTO): Promise<AxiosResponse> => {
  return axios.post(`/box-brand/metto-label/${mettoLabelId}`, data);
};

type UseUpdateMettoLabelOptions = {
  config?: MutationConfig<typeof updateMettoLabel>;
};

export const useUpdateMettoLabel = ({
  config,
}: UseUpdateMettoLabelOptions = {}) => {
  const mutation = useMutation({
    ...config,
    mutationFn: updateMettoLabel,
  });

  return { ...mutation, updateMettoLabel: mutation.mutateAsync };
};
