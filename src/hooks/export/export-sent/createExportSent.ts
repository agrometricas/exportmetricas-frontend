/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { useMutation } from '@tanstack/react-query';
import axios from '@/lib/axios';
import { MutationConfig } from '@/lib/react-query';

interface CreateExportSentResponse {
  exportSentId: string;
}

// The form's values, built from the backend's proposal: the quantity of each
// material and the cocktail lines.
export const createExportSent = (
  data: Record<string, unknown>
): Promise<CreateExportSentResponse> => {
  return axios.post('/export/export-sent', data);
};

type UseCreateExportSentOptions = {
  config?: MutationConfig<typeof createExportSent>;
};

export const useCreateExportSent = ({
  config,
}: UseCreateExportSentOptions = {}) => {
  const mutation = useMutation({
    ...config,
    mutationFn: createExportSent,
  });

  return { ...mutation, createExportSent: mutation.mutate };
};
