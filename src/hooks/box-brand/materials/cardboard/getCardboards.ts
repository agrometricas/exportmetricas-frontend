import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { AxiosResponse } from 'axios';
import axios from '@/lib/axios';
import { qk } from '@/lib/queryKeys';
import { CardboardType } from '@/types/box-brand/materials/cardboard';
import { serializeQueryResult } from '@/utils/serializeQueryResult';

function listCardboards(): Promise<AxiosResponse<CardboardType[]>> {
  return axios.get('/box-brand/cardboard');
}

export function useCardboards(): UseQueryResult<CardboardType[], unknown> {
  const result = useQuery({
    queryKey: qk('cardboards'),
    queryFn: () => listCardboards(),
  });
  return serializeQueryResult(result);
}
