import { AxiosResponse } from 'axios';
import { useQuery } from 'react-query';
import axios from '../../lib/axios';
import { ShippingContractResponse } from '../../types/shippingContract';
import { serializeQueryResult } from '../../utils/serializeQueryResult';

function listShippingContracts(): Promise<
  AxiosResponse<ShippingContractResponse[]>
> {
  return axios.get('/shipping-contracts');
}

export function useShippingContracts(): ReturnType<
  typeof serializeQueryResult
> {
  return serializeQueryResult(
    useQuery(['shippingContracts'], listShippingContracts)
  );
}
