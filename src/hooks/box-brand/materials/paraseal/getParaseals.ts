import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { AxiosResponse } from 'axios';
import axios from '@/lib/axios';
import { qk } from '@/lib/queryKeys';
import { ParasealType } from '@/types/box-brand/materials/paraseal';
import { serializeQueryResult } from '@/utils/serializeQueryResult';

function listParaseals(): Promise<AxiosResponse<ParasealType[]>> {
  return axios.get('/box-brand/paraseal');
}

export function useParaseals(): UseQueryResult<ParasealType[], unknown> {
  const result = useQuery({
    queryKey: qk('paraseals'),
    queryFn: () => listParaseals(),
  });
  return serializeQueryResult(result);
}
