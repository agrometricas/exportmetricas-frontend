import { useMutation, UseMutationResult } from '@tanstack/react-query';
import { AxiosError, AxiosResponse } from 'axios';
import axios from '@/lib/axios';
import {
  CorrectCuttingSheetBody,
  CuttingSheetDelivery,
} from '@/types/cuttingSheet';
import { ServerErrorResponse } from '@/types/errorResponse';

type CorrectionInput = { id: number; body: CorrectCuttingSheetBody };

function correctCuttingSheet({
  id,
  body,
}: CorrectionInput): Promise<AxiosResponse<CuttingSheetDelivery>> {
  return axios.put(`/export/cutting-sheets/${id}`, body);
}

export function useCorrectCuttingSheet(): UseMutationResult<
  AxiosResponse<CuttingSheetDelivery>,
  AxiosError<ServerErrorResponse>,
  CorrectionInput
> {
  return useMutation({ mutationFn: correctCuttingSheet });
}
