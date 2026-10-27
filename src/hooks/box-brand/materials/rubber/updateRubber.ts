/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { useMutation } from '@tanstack/react-query';
import { AxiosResponse } from 'axios';
import axios from '@/lib/axios';
import { MutationConfig } from '@/lib/react-query';
import { RubberType } from '@/types/box-brand/materials/rubber';

type updateRubberDTO = {
  data: Partial<RubberType>;
  rubberId: string;
};

const updateRubber = ({
  data,
  rubberId,
}: updateRubberDTO): Promise<AxiosResponse> => {
  return axios.post(`/box-brand/rubber/${rubberId}`, data);
};

type UseUpdateRubberOptions = {
  config?: MutationConfig<typeof updateRubber>;
};

export const useUpdateRubber = ({ config }: UseUpdateRubberOptions = {}) => {
  const mutation = useMutation({
    ...config,
    mutationFn: updateRubber,
  });

  return { ...mutation, updateRubber: mutation.mutateAsync };
};
