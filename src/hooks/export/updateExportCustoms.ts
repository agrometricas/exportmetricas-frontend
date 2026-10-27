import { useMutation, UseMutationResult } from '@tanstack/react-query';
import { AxiosError, AxiosResponse } from 'axios';
import axios from '../../lib/axios';
import { ExportCustomsBody } from '../../types/customs';
import { ServerErrorResponse } from '../../types/errorResponse';

type Input = { exportId: number; body: ExportCustomsBody };

function updateExportCustoms({
  exportId,
  body,
}: Input): Promise<AxiosResponse> {
  return axios.put(`/export/${exportId}/customs`, body);
}

export function useUpdateExportCustoms(): UseMutationResult<
  AxiosResponse,
  AxiosError<ServerErrorResponse>,
  Input
> {
  return useMutation({ mutationFn: updateExportCustoms });
}
