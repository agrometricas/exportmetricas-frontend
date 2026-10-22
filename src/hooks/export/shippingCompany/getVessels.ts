import { AxiosResponse } from 'axios';
import { useQuery } from 'react-query';
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
): ReturnType<typeof serializeQueryResult> {
  const id = Number(shippingCompanyId);
  return serializeQueryResult(
    useQuery(['vessels', id], () => listVessels(id), { enabled: id > 0 })
  );
}
