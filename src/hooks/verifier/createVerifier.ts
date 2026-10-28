// createVerifier.ts
import {
  useMutation,
  UseMutationOptions,
  UseMutationResult,
} from '@tanstack/react-query';
import { AxiosError } from 'axios';
import axios from '@/lib/axios';
import { ServerErrorResponse } from '../../types/errorResponse';
import { VerifierType } from '../../types/verifier/verifier';

interface CreateVerifierResponse {
  verifierId: string;
}

export const createVerifier = (
  data: Partial<VerifierType>
): Promise<CreateVerifierResponse> => {
  return axios.post('/verifier', data);
};

export const useCreateVerifier = (
  config?: UseMutationOptions<
    CreateVerifierResponse,
    AxiosError<ServerErrorResponse>,
    Partial<VerifierType>
  >
): UseMutationResult<
  CreateVerifierResponse,
  AxiosError<ServerErrorResponse>,
  Partial<VerifierType>
> => {
  return useMutation({
    mutationFn: createVerifier,
    ...config,
  });
};
