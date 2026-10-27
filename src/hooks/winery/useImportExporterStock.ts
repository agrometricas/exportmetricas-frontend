import { useMutation, UseMutationResult } from '@tanstack/react-query';
import axios from '@/lib/axios';
import { MutationConfig } from '@/lib/react-query';

interface ImportExporterStockResponse {
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

export const importExporterStock = (
  file: File
): Promise<ImportExporterStockResponse> => {
  const formData = new FormData();
  formData.append('file', file);

  return axios
    .post<ImportExporterStockResponse>(
      '/exporter-material-stock/import/exporter-only',
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    )
    .then((response) => response.data);
};

type UseImportExporterStockOptions = {
  config?: MutationConfig<typeof importExporterStock>;
};

export const useImportExporterStock = ({
  config,
}: UseImportExporterStockOptions = {}): UseMutationResult<
  ImportExporterStockResponse,
  unknown,
  File,
  unknown
> & {
  importExporterStock: (file: File) => void;
} => {
  const mutation = useMutation({
    mutationFn: importExporterStock,
    ...config,
  });

  return { ...mutation, importExporterStock: mutation.mutate };
};
