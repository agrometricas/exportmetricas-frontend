/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { useMutation } from '@tanstack/react-query';
import axios from '@/lib/axios';
import { MutationConfig } from '@/lib/react-query';
import { LatexRemoverType } from '@/types/box-brand/additions/latexRemover';

interface CreateLatexRemoverResponse {
  latexRemoverId: string;
}

export const createLatexRemover = (
  data: Partial<LatexRemoverType>
): Promise<CreateLatexRemoverResponse> => {
  return axios.post('/box-brand/latex-remover', data);
};

type UseCreateLatexRemoverOptions = {
  config?: MutationConfig<typeof createLatexRemover>;
};

export const useCreateLatexRemover = ({
  config,
}: UseCreateLatexRemoverOptions = {}) => {
  const mutation = useMutation({
    ...config,
    mutationFn: createLatexRemover,
  });

  return { ...mutation, createLatexRemover: mutation.mutate };
};
