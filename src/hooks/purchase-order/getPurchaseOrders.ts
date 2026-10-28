import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { AxiosResponse } from 'axios';
import axios from '../../lib/axios';
import { PurchaseOrderSummary } from '../../types/purchaseOrder';
import { serializeQueryResult } from '../../utils/serializeQueryResult';

function listPurchaseOrders(): Promise<AxiosResponse<PurchaseOrderSummary[]>> {
  return axios.get('/purchase-orders');
}

export function usePurchaseOrders(): UseQueryResult<
  PurchaseOrderSummary[],
  unknown
> {
  return serializeQueryResult(
    useQuery({
      queryKey: ['purchaseOrders'],
      queryFn: listPurchaseOrders,
    })
  );
}
