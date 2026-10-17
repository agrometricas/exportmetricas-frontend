import { AxiosResponse } from 'axios';
import { useQuery } from 'react-query';
import axios from '../../lib/axios';
import { ProducerContractResponse } from '../../types/producerContract';
import { serializeQueryResult } from '../../utils/serializeQueryResult';

function listProducerContracts(): Promise<AxiosResponse<ProducerContractResponse[]>> {
  return axios.get('/producer-contracts');
}

export function useProducerContracts(): ReturnType<typeof serializeQueryResult> {
  return serializeQueryResult(useQuery(['producerContracts'], listProducerContracts));
}
