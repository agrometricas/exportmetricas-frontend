import { AxiosError, AxiosResponse } from 'axios';
import { useMutation, UseMutationResult } from 'react-query';
import axios from '@/lib/axios';
import { CuttingType } from '@/types/cuttingType';
import { ServerErrorResponse } from '@/types/errorResponse';
import { CuttingTypeBody } from '@/utils/cuttingTypeForm';

type UpdateInput = { id: number; body: CuttingTypeBody };

function updateCuttingType({
  id,
  body,
}: UpdateInput): Promise<AxiosResponse<CuttingType>> {
  return axios.put(`/cutting-type/${id}`, body);
}

export function useUpdateCuttingType(): UseMutationResult<
  AxiosResponse<CuttingType>,
  AxiosError<ServerErrorResponse>,
  UpdateInput
> {
  return useMutation(updateCuttingType);
}
