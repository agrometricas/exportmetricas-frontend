import { useMutation, UseMutationResult } from '@tanstack/react-query';
import { AxiosError, AxiosResponse } from 'axios';
import axios from '../../lib/axios';
import { ServerErrorResponse } from '../../types/errorResponse';
import {
  PurchaseOrderBody,
  PurchaseOrderResponse,
} from '../../types/purchaseOrder';

type Saved = AxiosResponse<PurchaseOrderResponse>;
type SaveInput = { id?: number; body: PurchaseOrderBody };

function savePurchaseOrder({ id, body }: SaveInput): Promise<Saved> {
  return id
    ? axios.patch(`/purchase-orders/${id}`, body)
    : axios.post('/purchase-orders', body);
}

export function useSavePurchaseOrder(): UseMutationResult<
  Saved,
  AxiosError<ServerErrorResponse>,
  SaveInput
> {
  return useMutation({ mutationFn: savePurchaseOrder });
}

function deletePurchaseOrder(
  id: number
): Promise<AxiosResponse<{ id: number }>> {
  return axios.delete(`/purchase-orders/${id}`);
}

export function useDeletePurchaseOrder(): UseMutationResult<
  AxiosResponse<{ id: number }>,
  AxiosError<ServerErrorResponse>,
  number
> {
  return useMutation({ mutationFn: deletePurchaseOrder });
}
