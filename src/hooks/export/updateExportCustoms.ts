import { AxiosError, AxiosResponse } from 'axios';
import { useMutation, UseMutationResult } from 'react-query';
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
  return useMutation(updateExportCustoms);
}
