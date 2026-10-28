import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { AxiosResponse } from 'axios';
import { qk } from '@/lib/queryKeys';
import axios from '../../lib/axios';
import { ProducerContractResponse } from '../../types/producerContract';
import { serializeQueryResult } from '../../utils/serializeQueryResult';

function getProducerContract(
  id: string
): Promise<AxiosResponse<ProducerContractResponse>> {
  return axios.get(`/producer-contracts/${id}`);
}

export function useProducerContract(
  id: string
): UseQueryResult<ProducerContractResponse, unknown> {
  return serializeQueryResult(
    useQuery({
      queryKey: qk('producerContract', id),
      queryFn: () => getProducerContract(id),
      enabled: Boolean(id),
    })
  );
}
