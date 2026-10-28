import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { AxiosResponse } from 'axios';
import axios from '@/lib/axios';
import { LidType } from '@/types/box-brand/materials/lid';
import { serializeQueryResult } from '@/utils/serializeQueryResult';

function listLids(): Promise<AxiosResponse<LidType[]>> {
  return axios.get('/box-brand/lid');
}

export function useLids(): UseQueryResult<LidType[], unknown> {
  const result = useQuery({
    queryKey: ['lids'],
    queryFn: () => listLids(),
  });
  return serializeQueryResult(result);
}
