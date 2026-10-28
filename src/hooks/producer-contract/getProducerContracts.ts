import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { AxiosResponse } from 'axios';
import { qk } from '@/lib/queryKeys';
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
      queryKey: qk('producerContracts'),
      queryFn: listProducerContracts,
    })
  );
}
