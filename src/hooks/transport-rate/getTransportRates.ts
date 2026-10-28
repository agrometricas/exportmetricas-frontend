import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { AxiosResponse } from 'axios';
import { qk } from '@/lib/queryKeys';
import axios from '../../lib/axios';
import { TransportRateResponse } from '../../types/transportRate';
import { serializeQueryResult } from '../../utils/serializeQueryResult';

function listTransportRates(): Promise<AxiosResponse<TransportRateResponse[]>> {
  return axios.get('/transport-rates');
}

export function useTransportRates(): UseQueryResult<
  TransportRateResponse[],
  unknown
> {
  return serializeQueryResult(
    useQuery({
      queryKey: qk('transportRates'),
      queryFn: listTransportRates,
    })
  );
}
