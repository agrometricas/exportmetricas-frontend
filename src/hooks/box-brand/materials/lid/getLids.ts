import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { AxiosResponse } from 'axios';
import axios from '@/lib/axios';
import { qk } from '@/lib/queryKeys';
import { LidType } from '@/types/box-brand/materials/lid';
import { serializeQueryResult } from '@/utils/serializeQueryResult';

function listLids(): Promise<AxiosResponse<LidType[]>> {
  return axios.get('/box-brand/lid');
}

export function useLids(): UseQueryResult<LidType[], unknown> {
  const result = useQuery({
    queryKey: qk('lids'),
    queryFn: () => listLids(),
  });
  return serializeQueryResult(result);
}
