import { AxiosError, AxiosResponse } from 'axios';
import { useMutation, UseMutationResult } from 'react-query';
import axios from '../../lib/axios';
import { ServerErrorResponse } from '../../types/errorResponse';
import {
  ShippingContractBody,
  ShippingContractResponse,
} from '../../types/shippingContract';

type Saved = AxiosResponse<ShippingContractResponse>;
type SaveInput = { id?: number; body: ShippingContractBody };

function saveShippingContract({ id, body }: SaveInput): Promise<Saved> {
  return id
    ? axios.patch(`/shipping-contracts/${id}`, body)
    : axios.post('/shipping-contracts', body);
}

export function useSaveShippingContract(): UseMutationResult<
  Saved,
  AxiosError<ServerErrorResponse>,
  SaveInput
> {
  return useMutation(saveShippingContract);
}

function deleteShippingContract(
  id: number
): Promise<AxiosResponse<{ id: number }>> {
  return axios.delete(`/shipping-contracts/${id}`);
}

export function useDeleteShippingContract(): UseMutationResult<
  AxiosResponse<{ id: number }>,
  AxiosError<ServerErrorResponse>,
  number
> {
  return useMutation(deleteShippingContract);
}
