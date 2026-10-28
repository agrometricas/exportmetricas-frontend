import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { AxiosResponse } from 'axios';
import axios from '@/lib/axios';
import { qk } from '@/lib/queryKeys';
import { SealType } from '@/types/box-brand/container/seal';
import { serializeQueryResult } from '@/utils/serializeQueryResult';

function listSeals(): Promise<AxiosResponse<SealType[]>> {
  return axios.get('/box-brand/seal');
}

export function useSeals(): UseQueryResult<SealType[], unknown> {
  const result = useQuery({
    queryKey: qk('seals'),
    queryFn: () => listSeals(),
  });

  return serializeQueryResult(result);
}
