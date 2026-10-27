/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { useMutation } from '@tanstack/react-query';
import { AxiosResponse } from 'axios';
import axios from '@/lib/axios';
import { MutationConfig } from '@/lib/react-query';
import { ClusterBagType } from '@/types/box-brand/materials/clusterBag';

type updateClusterBagDTO = {
  data: Partial<ClusterBagType>;
  clusterBagId: string;
};

const updateClusterBag = ({
  data,
  clusterBagId,
}: updateClusterBagDTO): Promise<AxiosResponse> => {
  return axios.post(`/box-brand/cluster-bag/${clusterBagId}`, data);
};

type UseUpdateClusterBagOptions = {
  config?: MutationConfig<typeof updateClusterBag>;
};

export const useUpdateClusterBag = ({
  config,
}: UseUpdateClusterBagOptions = {}) => {
  const mutation = useMutation({
    ...config,
    mutationFn: updateClusterBag,
  });

  return { ...mutation, updateClusterBag: mutation.mutateAsync };
};
