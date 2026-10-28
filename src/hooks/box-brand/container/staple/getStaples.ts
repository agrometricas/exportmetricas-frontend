import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { AxiosResponse } from 'axios';
import axios from '@/lib/axios';
import { qk } from '@/lib/queryKeys';
import { StapleType } from '@/types/box-brand/container/staple';
import { serializeQueryResult } from '@/utils/serializeQueryResult';

function listStaples(): Promise<AxiosResponse<StapleType[]>> {
  return axios.get('/box-brand/staple');
}

export function useStaples(): UseQueryResult<StapleType[], unknown> {
  const result = useQuery({
    queryKey: qk('staples'),
    queryFn: () => listStaples(),
  });

  return serializeQueryResult(result);
}
