/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { useMutation } from '@tanstack/react-query';
import axios from '@/lib/axios';
import { MutationConfig } from '@/lib/react-query';

interface CreateMettoLabelResponse {
  mettoLabelId: string;
}

type CreateMettoLabelDTO = {
  name: string;
  quantityPerPack: number;
  art: File | null;
  code: string;
};

export const createMettoLabel = (
  data: CreateMettoLabelDTO
): Promise<CreateMettoLabelResponse> => {
  const formData = new FormData();

  formData.append('name', data.name);
  formData.append('quantityPerPack', String(data.quantityPerPack));
  formData.append('code', data.code);

  if (data.art) {
    formData.append('art', data.art);
  }

  return axios.post('/box-brand/metto-label', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

type UseCreateMettoLabelOptions = {
  config?: MutationConfig<typeof createMettoLabel>;
};

export const useCreateMettoLabel = ({
  config,
}: UseCreateMettoLabelOptions = {}) => {
  const mutation = useMutation({
    ...config,
    mutationFn: createMettoLabel,
  });

  return { ...mutation, createMettoLabel: mutation.mutate };
};
