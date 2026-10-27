import {
  useMutation,
  UseMutationOptions,
  UseMutationResult,
} from '@tanstack/react-query';
import { AxiosError } from 'axios';
import axios from '@/lib/axios';
import { ClientPaymentType } from '../../types/client-payment/client-payment';
import { ServerErrorResponse } from '../../types/errorResponse';

interface CreateClientPaymentResponse {
  clientPaymentId: number;
}

export const createClientPayment = async (
  data: Partial<ClientPaymentType>
): Promise<CreateClientPaymentResponse> => {
  const response = await axios.post('/client-payment', data);
  const firstRecord = response.data;
  if (!firstRecord || !firstRecord.id) {
    throw new Error('No se encontró un cobro válido en la respuesta');
  }
  return { clientPaymentId: firstRecord.id };
};

export const useCreateClientPayment = (
  config?: UseMutationOptions<
    CreateClientPaymentResponse,
    AxiosError<ServerErrorResponse>,
    Partial<ClientPaymentType>
  >
): UseMutationResult<
  CreateClientPaymentResponse,
  AxiosError<ServerErrorResponse>,
  Partial<ClientPaymentType>
> => {
  return useMutation({
    mutationFn: createClientPayment,
    ...config
  });
};
