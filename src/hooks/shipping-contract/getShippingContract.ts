import { AxiosResponse } from 'axios';
import { useQuery } from 'react-query';
import axios from '../../lib/axios';
import { ShippingContractResponse } from '../../types/shippingContract';
import { serializeQueryResult } from '../../utils/serializeQueryResult';

function getShippingContract(
  id: string
): Promise<AxiosResponse<ShippingContractResponse>> {
  return axios.get(`/shipping-contracts/${id}`);
}

export function useShippingContract(
  id: string
): ReturnType<typeof serializeQueryResult> {
  return serializeQueryResult(
    useQuery(['shippingContract', id], () => getShippingContract(id), {
      enabled: Boolean(id),
    })
  );
}
