/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { useMutation } from '@tanstack/react-query';
import axios from '@/lib/axios';
import { MutationConfig } from '@/lib/react-query';

interface CreateLabelResponse {
  labelId: string;
}

type CreateLabelDTO = {
  name: string;
  code: string;
  quantityPerRoll: number;
  art: File | null;
  description: string;
};

const createLabel = (data: CreateLabelDTO): Promise<CreateLabelResponse> => {
  const formData = new FormData();

  formData.append('name', data.name);
  formData.append('code', data.code);
  formData.append('quantityPerRoll', String(data.quantityPerRoll));
  formData.append('description', data.description);

  if (data.art) {
    formData.append('art', data.art);
  }

  return axios.post('/box-brand/label', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

type UseCreateLabelOptions = {
  config?: MutationConfig<typeof createLabel>;
};

export const useCreateLabel = ({ config }: UseCreateLabelOptions = {}) => {
  const mutation = useMutation({
    ...config,
    mutationFn: createLabel,
  });

  return { ...mutation, createLabel: mutation.mutateAsync };
};
