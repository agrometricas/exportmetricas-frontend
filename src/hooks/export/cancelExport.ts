import {
  useMutation,
  UseMutationOptions,
  UseMutationResult,
} from '@tanstack/react-query';
import { AxiosError, AxiosResponse } from 'axios';
import axios from '@/lib/axios';
import { ServerErrorResponse } from '../../types/errorResponse';

export interface CancelExportResult {
  id: number;
  cancelledAt: string;
  returnedLines: number;
}

interface CancelExportVariables {
  exportId: number;
  reason?: string;
}

export const cancelExport = ({
  exportId,
  reason,
}: CancelExportVariables): Promise<AxiosResponse<CancelExportResult>> => {
  return axios.post(`/export/${exportId}/cancel`, reason ? { reason } : {});
};

export const useCancelExport = (
  config?: UseMutationOptions<
    AxiosResponse<CancelExportResult>,
    AxiosError<ServerErrorResponse>,
    CancelExportVariables
  >
): UseMutationResult<
  AxiosResponse<CancelExportResult>,
  AxiosError<ServerErrorResponse>,
  CancelExportVariables
> => {
  return useMutation({
    mutationFn: cancelExport,
    ...config,
  });
};
