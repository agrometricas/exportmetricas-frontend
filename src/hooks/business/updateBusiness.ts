import { AxiosError, AxiosResponse } from 'axios';
import { useMutation, UseMutationResult } from 'react-query';
import axios from '@/lib/axios';
import { ServerErrorResponse } from '@/types/errorResponse';
import {
  BusinessDetail,
  BusinessUpdateBody,
} from '@/types/merchant/businessDetail';

type UpdateInput = { businessId: number; body: BusinessUpdateBody };

function updateBusiness({
  businessId,
  body,
}: UpdateInput): Promise<AxiosResponse<BusinessDetail>> {
  return axios.patch(`/merchant/business/${businessId}`, body);
}

export function useUpdateBusiness(): UseMutationResult<
  AxiosResponse<BusinessDetail>,
  AxiosError<ServerErrorResponse>,
  UpdateInput
> {
  return useMutation(updateBusiness);
}
