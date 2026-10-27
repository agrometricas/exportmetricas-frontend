import { useQuery } from '@tanstack/react-query';
import { AxiosResponse } from 'axios';
import axios from '../../lib/axios';
import { TransportRateResponse } from '../../types/transportRate';
import { serializeQueryResult } from '../../utils/serializeQueryResult';

function listTransportRates(): Promise<AxiosResponse<TransportRateResponse[]>> {
  return axios.get('/transport-rates');
}

export function useTransportRates(): ReturnType<typeof serializeQueryResult> {
  return serializeQueryResult(
    useQuery({
      queryKey: ['transportRates'],
      queryFn: listTransportRates,
    })
  );
}
