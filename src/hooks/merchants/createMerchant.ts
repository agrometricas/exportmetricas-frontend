import { useMutation, UseMutationOptions, UseMutationResult } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import axios from '@/lib/axios';
import { MerchantType } from '@/types/merchant/merchant';
import { ServerErrorResponse } from '../../types/errorResponse';

interface CreateMerchantResponse {
  merchantId: string;
}

export const createMerchant = (
  data: Partial<MerchantType>
): Promise<CreateMerchantResponse> => {
  return axios.post('/merchant', data);
};

export const useCreateMerchant = (
  config?: UseMutationOptions<
    CreateMerchantResponse,
    AxiosError<ServerErrorResponse>,
    Partial<MerchantType>
  >
): UseMutationResult<
  CreateMerchantResponse,
  AxiosError<ServerErrorResponse>,
  Partial<MerchantType>
> => {
  return useMutation({
    mutationFn: createMerchant,
    ...config
  });
};
