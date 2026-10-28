import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { AxiosResponse } from 'axios';
import axios from '../../lib/axios';
import { ProducerContractResponse } from '../../types/producerContract';
import { serializeQueryResult } from '../../utils/serializeQueryResult';

function listProducerContracts(): Promise<
  AxiosResponse<ProducerContractResponse[]>
> {
  return axios.get('/producer-contracts');
}

export function useProducerContracts(): UseQueryResult<
  ProducerContractResponse[],
  unknown
> {
  return serializeQueryResult(
    useQuery({
      queryKey: ['producerContracts'],
      queryFn: listProducerContracts,
    })
  );
}
