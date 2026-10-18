import { AxiosResponse } from 'axios';
import { useQuery } from 'react-query';
import axios from '../../lib/axios';
import { PurchaseOrderSummary } from '../../types/purchaseOrder';
import { serializeQueryResult } from '../../utils/serializeQueryResult';

function listPurchaseOrders(): Promise<AxiosResponse<PurchaseOrderSummary[]>> {
  return axios.get('/purchase-orders');
}

export function usePurchaseOrders(): ReturnType<typeof serializeQueryResult> {
  return serializeQueryResult(useQuery(['purchaseOrders'], listPurchaseOrders));
}
