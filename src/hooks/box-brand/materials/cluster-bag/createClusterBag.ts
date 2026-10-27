/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { useMutation } from '@tanstack/react-query';
import axios from '@/lib/axios';
import { MutationConfig } from '@/lib/react-query';

interface CreateClusterBagResponse {
  clusterBagId: string;
}

type CreateClusterBagDTO = {
  name: string;
  code: string;
  quantityPerPack: number;
  art: File | null;
  dimensions: string;
};

export const createClusterBag = (
  data: CreateClusterBagDTO
): Promise<CreateClusterBagResponse> => {
  const formData = new FormData();

  formData.append('name', data.name);
  formData.append('code', data.code);
  formData.append('quantityPerPack', String(data.quantityPerPack));
  formData.append('dimensions', data.dimensions);

  if (data.art) {
    formData.append('art', data.art);
  }

  return axios.post('/box-brand/cluster-bag', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

type UseCreateClusterBagOptions = {
  config?: MutationConfig<typeof createClusterBag>;
};

export const useCreateClusterBag = ({
  config,
}: UseCreateClusterBagOptions = {}) => {
  const mutation = useMutation({
    ...config,
    mutationFn: createClusterBag,
  });

  return { ...mutation, createClusterBag: mutation.mutate };
};
