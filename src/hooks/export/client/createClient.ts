import {
  useMutation,
  UseMutationOptions,
  UseMutationResult,
} from '@tanstack/react-query';
import { AxiosError } from 'axios';
import axios from '@/lib/axios';
import { ClientType } from '../../../types/client';
import { ServerErrorResponse } from '../../../types/errorResponse';

interface CreateClientResponse {
  clientId: string;
}

export const createClient = (
  data: Partial<ClientType>
): Promise<CreateClientResponse> => {
  return axios.post('/client', data);
};

export const useCreateClient = (
  config?: UseMutationOptions<
    CreateClientResponse,
    AxiosError<ServerErrorResponse>,
    Partial<ClientType>
  >
): UseMutationResult<
  CreateClientResponse,
  AxiosError<ServerErrorResponse>,
  Partial<ClientType>
> => {
  return useMutation({
    mutationFn: createClient,
    ...config,
  });
};
