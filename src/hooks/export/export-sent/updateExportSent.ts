/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { useMutation } from '@tanstack/react-query';
import { AxiosResponse } from 'axios';
import axios from '@/lib/axios';
import { MutationConfig } from '@/lib/react-query';
import { ExportSentType } from '@/types/exportSent';

type updateExportSentDTO = {
  data: Partial<ExportSentType>;
  exporSentId: string;
};

const updateExportSent = ({
  data,
  exporSentId,
}: updateExportSentDTO): Promise<AxiosResponse> => {
  return axios.post(`/export/export-sent/${exporSentId}`, data);
};

type UseUpdateExportSentOptions = {
  config?: MutationConfig<typeof updateExportSent>;
};

export const useUpdateExportSent = ({
  config,
}: UseUpdateExportSentOptions = {}) => {
  const mutation = useMutation({
    ...config,
    mutationFn: updateExportSent,
  });

  return { ...mutation, updateExportSent: mutation.mutateAsync };
};
