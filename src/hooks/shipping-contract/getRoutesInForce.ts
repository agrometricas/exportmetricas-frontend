import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { AxiosResponse } from 'axios';
import axios from '../../lib/axios';
import { RouteInForce } from '../../types/booking';
import { serializeQueryResult } from '../../utils/serializeQueryResult';

function listRoutesInForce(
  shippingCompanyId: number,
  date: string
): Promise<AxiosResponse<RouteInForce[]>> {
  return axios.get('/shipping-contracts/routes', {
    params: { shippingCompanyId, date },
  });
}

// Whether a contract is in force depends on the day, so the list is asked for
// again whenever the shipping company or the departure changes.
export function useRoutesInForce(
  shippingCompanyId: number | '',
  date: string | null
): UseQueryResult<RouteInForce[], unknown> {
  return serializeQueryResult(
    useQuery({
      queryKey: ['shippingRoutesInForce', shippingCompanyId, date],
      queryFn: () =>
        listRoutesInForce(Number(shippingCompanyId), date as string),
      enabled: Boolean(shippingCompanyId) && Boolean(date),
    })
  );
}
