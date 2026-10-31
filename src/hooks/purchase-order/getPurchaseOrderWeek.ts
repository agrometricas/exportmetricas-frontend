import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { AxiosResponse } from 'axios';
import { qk } from '@/lib/queryKeys';
import axios from '../../lib/axios';
import { WeekDemand } from '../../types/purchaseOrder';
import { serializeQueryResult } from '../../utils/serializeQueryResult';

function getPurchaseOrderWeek(
  week: string
): Promise<AxiosResponse<WeekDemand>> {
  return axios.get('/purchase-orders/week', { params: { week } });
}

export function usePurchaseOrderWeek(
  week: string | null
): UseQueryResult<WeekDemand, unknown> {
  return serializeQueryResult(
    useQuery({
      queryKey: qk('purchaseOrderWeek', week),
      queryFn: () => getPurchaseOrderWeek(week as string),
      enabled: week !== null,
    })
  );
}
