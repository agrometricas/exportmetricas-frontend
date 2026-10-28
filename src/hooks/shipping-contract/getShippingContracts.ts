import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { AxiosResponse } from 'axios';
import axios from '../../lib/axios';
import { ShippingContractResponse } from '../../types/shippingContract';
import { serializeQueryResult } from '../../utils/serializeQueryResult';

function listShippingContracts(): Promise<
  AxiosResponse<ShippingContractResponse[]>
> {
  return axios.get('/shipping-contracts');
}

export function useShippingContracts(): UseQueryResult<
  ShippingContractResponse[],
  unknown
> {
  return serializeQueryResult(
    useQuery({
      queryKey: ['shippingContracts'],
      queryFn: listShippingContracts,
    })
  );
}
