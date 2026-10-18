import { AxiosError, AxiosResponse } from 'axios';
import { useMutation, UseMutationResult } from 'react-query';
import axios from '../../lib/axios';
import { ServerErrorResponse } from '../../types/errorResponse';
import {
  TransportRateBody,
  TransportRateResponse,
} from '../../types/transportRate';

type Saved = AxiosResponse<TransportRateResponse>;
type SaveInput = { id?: number; body: TransportRateBody };

function saveTransportRate({ id, body }: SaveInput): Promise<Saved> {
  return id
    ? axios.patch(`/transport-rates/${id}`, body)
    : axios.post('/transport-rates', body);
}

export function useSaveTransportRate(): UseMutationResult<
  Saved,
  AxiosError<ServerErrorResponse>,
  SaveInput
> {
  return useMutation(saveTransportRate);
}

function deleteTransportRate(
  id: number
): Promise<AxiosResponse<{ id: number }>> {
  return axios.delete(`/transport-rates/${id}`);
}

export function useDeleteTransportRate(): UseMutationResult<
  AxiosResponse<{ id: number }>,
  AxiosError<ServerErrorResponse>,
  number
> {
  return useMutation(deleteTransportRate);
}
