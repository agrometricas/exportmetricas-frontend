import {
  useMutation,
  UseMutationOptions,
  UseMutationResult,
} from '@tanstack/react-query';
import { AxiosError } from 'axios';
import axios from '@/lib/axios';
import { ExportType } from '@/types/export';
import { ServerErrorResponse } from '../../types/errorResponse';

interface CreateExportResponse {
  exportId: string;
}

export const createExport = (
  data: Partial<ExportType>
): Promise<CreateExportResponse> => {
  return axios.post('/export', data);
};

export const useCreateExport = (
  config?: UseMutationOptions<
    CreateExportResponse,
    AxiosError<ServerErrorResponse>,
    Partial<ExportType>
  >
): UseMutationResult<
  CreateExportResponse,
  AxiosError<ServerErrorResponse>,
  Partial<ExportType>
> => {
  return useMutation({
    mutationFn: createExport,
    ...config,
  });
};
