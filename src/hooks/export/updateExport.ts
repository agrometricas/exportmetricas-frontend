import { AxiosError, AxiosResponse } from 'axios';
import {
  useMutation,
  UseMutationOptions,
  UseMutationResult,
} from 'react-query';
import axios from '@/lib/axios';
import { ExportType } from '@/types/export';
import { ServerErrorResponse } from '../../types/errorResponse';

interface UpdateExportVariables {
  exportId: number;
  data: Partial<ExportType>;
}

export const updateExport = ({
  exportId,
  data,
}: UpdateExportVariables): Promise<AxiosResponse> => {
  return axios.put(`/export/${exportId}`, data);
};

export const useUpdateExport = (
  config?: UseMutationOptions<
    AxiosResponse,
    AxiosError<ServerErrorResponse>,
    UpdateExportVariables
  >
): UseMutationResult<
  AxiosResponse,
  AxiosError<ServerErrorResponse>,
  UpdateExportVariables
> => {
  return useMutation(updateExport, config);
};
