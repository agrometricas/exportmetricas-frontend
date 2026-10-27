import { useMutation } from '@tanstack/react-query';
import axios from '@/lib/axios';
import { MutationConfig } from '@/lib/react-query';
import { InsecticideType } from '@/types/box-brand/additions/insecticide';

interface CreateInsecticideResponse {
  insecticideId: string;
}

export const createInsecticide = (
  data: Partial<InsecticideType>
): Promise<CreateInsecticideResponse> => {
  return axios.post('/box-brand/insecticide', data);
};

type UseCreateInsecticideOptions = {
  config?: MutationConfig<typeof createInsecticide>;
};

export const useCreateInsecticide = ({
  config,
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/explicit-function-return-type
}: UseCreateInsecticideOptions = {}) => {
  const mutation = useMutation({
    ...config,
    mutationFn: createInsecticide,
  });

  return { ...mutation, createInsecticide: mutation.mutate };
};
