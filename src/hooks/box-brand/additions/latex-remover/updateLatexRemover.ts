/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { useMutation } from '@tanstack/react-query';
import { AxiosResponse } from 'axios';
import axios from '@/lib/axios';
import { MutationConfig } from '@/lib/react-query';
import { LatexRemoverType } from '@/types/box-brand/additions/latexRemover';

type updateLatexRemoverDTO = {
  data: Partial<LatexRemoverType>;
  latexRemoverId: string;
};

const updateLatexRemover = ({
  data,
  latexRemoverId,
}: updateLatexRemoverDTO): Promise<AxiosResponse> => {
  return axios.post(`/box-brand/latex-remover/${latexRemoverId}`, data);
};

type UseUpdateLatexRemoverOptions = {
  config?: MutationConfig<typeof updateLatexRemover>;
};

export const useUpdateLatexRemover = ({
  config,
  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
}: UseUpdateLatexRemoverOptions = {}) => {
  const mutation = useMutation({
    ...config,
    mutationFn: updateLatexRemover,
  });

  return { ...mutation, updateLatexRemover: mutation.mutateAsync };
};
