import {
  useMutation,
  UseMutationOptions,
  UseMutationResult,
} from '@tanstack/react-query';
import { AxiosError } from 'axios';
import axios from '../../lib/axios';
import { ServerErrorResponse } from '../../types/errorResponse';
import { BusinessType } from '../../types/merchant/business';

interface CreateBusinessResponse {
  businessId: string;
}

export const createBusiness = (
  data: Partial<BusinessType>
): Promise<CreateBusinessResponse> => {
  return axios.post('/merchant/business', data);
};

export const useCreateBusiness = (
  config?: UseMutationOptions<
    CreateBusinessResponse,
    AxiosError<ServerErrorResponse>,
    Partial<BusinessType>
  >
): UseMutationResult<
  CreateBusinessResponse,
  AxiosError<ServerErrorResponse>,
  Partial<BusinessType>
> => {
  return useMutation({
    mutationFn: createBusiness,
    ...config,
  });
};
