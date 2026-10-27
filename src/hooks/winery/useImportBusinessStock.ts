import { useMutation, UseMutationResult } from '@tanstack/react-query';
import axios from '@/lib/axios';
import { MutationConfig } from '@/lib/react-query';

interface ImportBusinessStockResponse {
  message: string;
  details: {
    successCount: number;
    errorCount: number;
    errors: Array<{
      row: number;
      message: string;
    }>;
  };
}

export const importBusinessStock = (
  file: File
): Promise<ImportBusinessStockResponse> => {
  const formData = new FormData();
  formData.append('file', file);

  return axios
    .post<ImportBusinessStockResponse>(
      '/exporter-material-stock/import',
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    )
    .then((response) => response.data);
};

type UseImportBusinessStockOptions = {
  config?: MutationConfig<typeof importBusinessStock>;
};

export const useImportBusinessStock = ({
  config,
}: UseImportBusinessStockOptions = {}): UseMutationResult<
  ImportBusinessStockResponse,
  unknown,
  File,
  unknown
> & {
  importBusinessStock: (file: File) => void;
} => {
  const mutation = useMutation({
    mutationFn: importBusinessStock,
    ...config,
  });

  return { ...mutation, importBusinessStock: mutation.mutate };
};
