import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { AxiosResponse } from 'axios';
import { qk } from '@/lib/queryKeys';
import axios from '../../../lib/axios';
import { Vessel } from '../../../types/vessel';
import { serializeQueryResult } from '../../../utils/serializeQueryResult';

function listVessels(
  shippingCompanyId: number
): Promise<AxiosResponse<Vessel[]>> {
  return axios.get(`/harbor/shipping-company/${shippingCompanyId}/vessels`);
}

export function useVessels(
  shippingCompanyId: number | ''
): UseQueryResult<Vessel[], unknown> {
  const id = Number(shippingCompanyId);
  return serializeQueryResult(
    useQuery({
      queryKey: qk('vessels', id),
      queryFn: () => listVessels(id),
      enabled: id > 0,
    })
  );
}
