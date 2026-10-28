import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { AxiosResponse } from 'axios';
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
): UseQueryResult<ShippingContractResponse, unknown> {
  return serializeQueryResult(
    useQuery({
      queryKey: ['shippingContract', id],
      queryFn: () => getShippingContract(id),
      enabled: Boolean(id),
    })
  );
}
