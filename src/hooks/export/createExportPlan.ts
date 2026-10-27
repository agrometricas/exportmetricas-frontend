import { useMutation, UseMutationResult } from '@tanstack/react-query';
import { AxiosError, AxiosResponse } from 'axios';
import axios from '../../lib/axios';
import { ServerErrorResponse } from '../../types/errorResponse';
import { ExportPlanBody, ExportPlanResponse } from '../../types/exportPlan';

function createExportPlan(
  body: ExportPlanBody
): Promise<AxiosResponse<ExportPlanResponse>> {
  return axios.post('/export/plan', body);
}

export function useCreateExportPlan(): UseMutationResult<
  AxiosResponse<ExportPlanResponse>,
  AxiosError<ServerErrorResponse>,
  ExportPlanBody
> {
  return useMutation({ mutationFn: createExportPlan });
}
