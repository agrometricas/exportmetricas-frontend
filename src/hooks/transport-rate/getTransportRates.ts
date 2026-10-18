import { AxiosResponse } from 'axios';
import { useQuery } from 'react-query';
import axios from '../../lib/axios';
import { TransportRateResponse } from '../../types/transportRate';
import { serializeQueryResult } from '../../utils/serializeQueryResult';

function listTransportRates(): Promise<AxiosResponse<TransportRateResponse[]>> {
  return axios.get('/transport-rates');
}

export function useTransportRates(): ReturnType<typeof serializeQueryResult> {
  return serializeQueryResult(useQuery(['transportRates'], listTransportRates));
}
