/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { useMutation } from '@tanstack/react-query';
import axios from '@/lib/axios';
import { MutationConfig } from '@/lib/react-query';

interface ImportClientsResponse {
  message: string;
}

export const importClients = (file: File): Promise<ImportClientsResponse> => {
  const formData = new FormData();
  formData.append('file', file);

  return axios.post('/client/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

type UseImportClientsOptions = {
  config?: MutationConfig<typeof importClients>;
};

export const useImportClients = ({ config }: UseImportClientsOptions = {}) => {
  const mutation = useMutation({
    mutationFn: importClients,
    ...config,
  });

  return { ...mutation, importClients: mutation.mutate };
};
