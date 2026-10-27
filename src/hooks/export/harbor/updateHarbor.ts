/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { useMutation } from '@tanstack/react-query';
import { AxiosResponse } from 'axios';
import axios from '@/lib/axios';
import { MutationConfig } from '@/lib/react-query';
import { HarborType } from '@/types/harbor';

type updateHarborDTO = {
  data: Partial<HarborType>;
  harborId: string;
};

const updateHarbor = ({
  data,
  harborId,
}: updateHarborDTO): Promise<AxiosResponse> => {
  return axios.post(`/harbor/${harborId}`, data);
};

type UseUpdateHarborOptions = {
  config?: MutationConfig<typeof updateHarbor>;
};

export const useUpdateHarbor = ({ config }: UseUpdateHarborOptions = {}) => {
  const mutation = useMutation({
    ...config,
    mutationFn: updateHarbor,
  });

  return { ...mutation, updateHarbor: mutation.mutateAsync };
};
