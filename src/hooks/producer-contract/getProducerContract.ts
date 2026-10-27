import { useQuery } from '@tanstack/react-query';
import { AxiosResponse } from 'axios';
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
): ReturnType<typeof serializeQueryResult> {
  return serializeQueryResult(
    useQuery({
      queryKey: ['producerContract', id],
      queryFn: () => getProducerContract(id),
      enabled: Boolean(id),
    })
  );
}
