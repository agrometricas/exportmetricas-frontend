import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { AxiosResponse } from 'axios';
import axios from '@/lib/axios';
import { qk } from '@/lib/queryKeys';
import { serializeQueryResult } from '@/utils/serializeQueryResult';
import { DepositResponse } from '../../types/deposit/deposit.response';

function listDeposits(): Promise<AxiosResponse<DepositResponse[]>> {
  return axios.get('/deposit');
}

export function useDeposits(): UseQueryResult<DepositResponse[], unknown> {
  const result = useQuery({
    queryKey: qk('deposits'),
    queryFn: () => listDeposits(),
  });

  return serializeQueryResult(result);
}
