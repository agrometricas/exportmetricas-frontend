/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { useMutation } from '@tanstack/react-query';
import axios from '@/lib/axios';
import { MutationConfig } from '@/lib/react-query';

interface ImportMerchantsResponse {
  message: string;
}

export const importMerchants = (
  file: File
): Promise<ImportMerchantsResponse> => {
  const formData = new FormData();
  formData.append('file', file);

  return axios.post('/merchant/business/import', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

type UseImportMerchantsOptions = {
  config?: MutationConfig<typeof importMerchants>;
};

export const useImportMerchants = ({
  config,
}: UseImportMerchantsOptions = {}) => {
  const mutation = useMutation({
    mutationFn: importMerchants,
    ...config,
  });

  return { ...mutation, importMerchants: mutation.mutate };
};
