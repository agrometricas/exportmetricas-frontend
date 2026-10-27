import {
  useMutation,
  UseMutationOptions,
  UseMutationResult,
} from '@tanstack/react-query';
import { AxiosError } from 'axios';
import axios from '@/lib/axios';
import { ServerErrorResponse } from '../../../types/errorResponse';
import { ShippingCompanyType } from '../../../types/shippingCompany.create';

interface CreateShippingCompanyResponse {
  shippingCompanyId: string;
}

export const createShippingCompany = (
  data: Partial<ShippingCompanyType>
): Promise<CreateShippingCompanyResponse> => {
  return axios.post('harbor/shipping-company', data);
};

export const useCreateShippingCompany = (
  config?: UseMutationOptions<
    CreateShippingCompanyResponse,
    AxiosError<ServerErrorResponse>,
    Partial<ShippingCompanyType>
  >
): UseMutationResult<
  CreateShippingCompanyResponse,
  AxiosError<ServerErrorResponse>,
  Partial<ShippingCompanyType>
> => {
  return useMutation({
    mutationFn: createShippingCompany,
    ...config,
  });
};
