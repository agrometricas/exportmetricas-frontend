/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { useMutation } from '@tanstack/react-query';
import axios from '@/lib/axios';
import { MutationConfig } from '@/lib/react-query';
import { ReinforcementType } from '@/types/box-brand/materials/reinforcement';

interface CreateReinforcementResponse {
  reinforcementId: string;
}

export const createReinforcement = (
  data: Partial<ReinforcementType>
): Promise<CreateReinforcementResponse> => {
  return axios.post('/box-brand/reinforcement', data);
};

type UseCreateReinforcementOptions = {
  config?: MutationConfig<typeof createReinforcement>;
};

export const useCreateReinforcement = ({
  config,
}: UseCreateReinforcementOptions = {}) => {
  const mutation = useMutation({
    ...config,
    mutationFn: createReinforcement,
  });

  return { ...mutation, createReinforcement: mutation.mutate };
};
