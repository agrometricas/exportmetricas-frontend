import { useMutation, UseMutationResult } from '@tanstack/react-query';
import axios from '@/lib/axios';
import { MutationConfig } from '@/lib/react-query';

interface ImportBoxBrandMaterialsResponse {
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

export const importBoxBrandMaterials = (
  file: File
): Promise<ImportBoxBrandMaterialsResponse> => {
  const formData = new FormData();
  formData.append('file', file);

  return axios
    .post<ImportBoxBrandMaterialsResponse>(
      '/box-brand/materials/import',
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    )
    .then((response) => response.data);
};

type UseImportBoxBrandMaterialsOptions = {
  config?: MutationConfig<typeof importBoxBrandMaterials>;
};

export const useImportBoxBrandMaterials = ({
  config,
}: UseImportBoxBrandMaterialsOptions = {}): UseMutationResult<
  ImportBoxBrandMaterialsResponse,
  unknown,
  File,
  unknown
> & {
  importBoxBrandMaterials: (file: File) => void;
} => {
  const mutation = useMutation({
    mutationFn: importBoxBrandMaterials,
    ...config,
  });

  return { ...mutation, importBoxBrandMaterials: mutation.mutate };
};
