import {
  useMutation,
  UseMutationOptions,
  UseMutationResult,
} from '@tanstack/react-query';
import { AxiosError, AxiosResponse } from 'axios';
import axios from '@/lib/axios';
import { ServerErrorResponse } from '../../types/errorResponse';

export const downloadMaterialsSummary = (
  date: string
): Promise<AxiosResponse<Blob>> => {
  return axios.get(`/reports/materials-summary?date=${date}`, {
    responseType: 'blob',
  });
};

export const useDownloadMaterialsSummaryReport = (
  config?: UseMutationOptions<
    AxiosResponse<Blob>,
    AxiosError<ServerErrorResponse>,
    string
  >
): UseMutationResult<
  AxiosResponse<Blob>,
  AxiosError<ServerErrorResponse>,
  string
> => {
  return useMutation({
    mutationFn: downloadMaterialsSummary,
    ...config,
  });
};
