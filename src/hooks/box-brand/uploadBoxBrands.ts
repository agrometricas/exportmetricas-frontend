import { useMutation, UseMutationResult } from '@tanstack/react-query';
import axios from '@/lib/axios';
import { MutationConfig } from '@/lib/react-query';

interface ImportBoxBrandsResponse {
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

export const importBoxBrands = (
  file: File
): Promise<ImportBoxBrandsResponse> => {
  const formData = new FormData();
  formData.append('file', file);

  return axios
    .post<
      ImportBoxBrandsResponse
    >('/box-brand/upload-csv', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    .then((response) => response.data);
};

type UseImportBoxBrandsOptions = {
  config?: MutationConfig<typeof importBoxBrands>;
};

export const useImportBoxBrands = ({
  config,
}: UseImportBoxBrandsOptions = {}): UseMutationResult<
  ImportBoxBrandsResponse,
  unknown,
  File,
  unknown
> & {
  importBoxBrands: (file: File) => void;
} => {
  const mutation = useMutation({
    mutationFn: importBoxBrands,
    ...config,
  });

  return { ...mutation, importBoxBrands: mutation.mutate };
};
