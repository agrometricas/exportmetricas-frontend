import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { AxiosResponse } from 'axios';
import { qk } from '@/lib/queryKeys';
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
): UseQueryResult<PurchaseOrderResponse, unknown> {
  return serializeQueryResult(
    useQuery({
      queryKey: qk('purchaseOrder', id),
      queryFn: () => getPurchaseOrder(id),
      enabled: Boolean(id),
    })
  );
}
