import { AxiosError, AxiosResponse } from 'axios';
import { useMutation, UseMutationResult } from 'react-query';
import axios from '../../lib/axios';
import { ServerErrorResponse } from '../../types/errorResponse';
import {
  ProducerContractBody,
  ProducerContractResponse,
} from '../../types/producerContract';

type Saved = AxiosResponse<ProducerContractResponse>;
type SaveInput = { id?: number; body: ProducerContractBody };

function saveProducerContract({ id, body }: SaveInput): Promise<Saved> {
  return id
    ? axios.patch(`/producer-contracts/${id}`, body)
    : axios.post('/producer-contracts', body);
}

export function useSaveProducerContract(): UseMutationResult<
  Saved,
  AxiosError<ServerErrorResponse>,
  SaveInput
> {
  return useMutation(saveProducerContract);
}

function deleteProducerContract(id: number): Promise<AxiosResponse<{ id: number }>> {
  return axios.delete(`/producer-contracts/${id}`);
}

export function useDeleteProducerContract(): UseMutationResult<
  AxiosResponse<{ id: number }>,
  AxiosError<ServerErrorResponse>,
  number
> {
  return useMutation(deleteProducerContract);
}
