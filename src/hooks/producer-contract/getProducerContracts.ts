import { useQuery } from '@tanstack/react-query';
import { AxiosResponse } from 'axios';
import axios from '../../lib/axios';
import { ProducerContractResponse } from '../../types/producerContract';
import { serializeQueryResult } from '../../utils/serializeQueryResult';

function listProducerContracts(): Promise<AxiosResponse<ProducerContractResponse[]>> {
  return axios.get('/producer-contracts');
}

export function useProducerContracts(): ReturnType<typeof serializeQueryResult> {
  return serializeQueryResult(useQuery({
    queryKey: ['producerContracts'],
    queryFn: listProducerContracts
  }));
}
