import { useMutation } from '@tanstack/react-query';
import { AxiosResponse } from 'axios';
import axios from '@/lib/axios';
import { MutationConfig } from '@/lib/react-query';
import { InsecticideType } from '@/types/box-brand/additions/insecticide';

type updateInsecticideDTO = {
  data: Partial<InsecticideType>;
  insecticideId: string;
};

const updateInsecticide = ({
  data,
  insecticideId,
}: updateInsecticideDTO): Promise<AxiosResponse> => {
  return axios.post(`/box-brand/insecticide/${insecticideId}`, data);
};

type UseUpdateInsecticideOptions = {
  config?: MutationConfig<typeof updateInsecticide>;
};

export const useUpdateInsecticide = ({
  config,
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/explicit-function-return-type
}: UseUpdateInsecticideOptions = {}) => {
  const mutation = useMutation({
    ...config,
    mutationFn: updateInsecticide,
  });

  return { ...mutation, updateInsecticide: mutation.mutateAsync };
};
