/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { useMutation } from '@tanstack/react-query';
import axios from '@/lib/axios';
import { MutationConfig } from '@/lib/react-query';
import { ExportSentType } from '@/types/exportSent';

interface CreateExportSentResponse {
  exportSentId: string;
}

export const createExportSent = (
  data: Partial<ExportSentType>
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
