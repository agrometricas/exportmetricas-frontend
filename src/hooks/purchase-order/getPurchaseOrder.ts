import { AxiosResponse } from 'axios';
import { useQuery } from 'react-query';
import axios from '../../lib/axios';
import { PurchaseOrderResponse } from '../../types/purchaseOrder';
import { serializeQueryResult } from '../../utils/serializeQueryResult';

function getPurchaseOrder(
  id: string
): Promise<AxiosResponse<PurchaseOrderResponse>> {
  return axios.get(`/purchase-orders/${id}`);
}

export function usePurchaseOrder(
  id: string
): ReturnType<typeof serializeQueryResult> {
  return serializeQueryResult(
    useQuery(['purchaseOrder', id], () => getPurchaseOrder(id), {
      enabled: Boolean(id),
    })
  );
}
