import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { AxiosResponse } from 'axios';
import axios from '@/lib/axios';
import { BottomType } from '@/types/box-brand/materials/bottom';
import { serializeQueryResult } from '@/utils/serializeQueryResult';

function listBottoms(): Promise<AxiosResponse<BottomType[]>> {
  return axios.get('/box-brand/bottom');
}

export function useBottoms(): UseQueryResult<BottomType[], unknown> {
  const result = useQuery({
    queryKey: ['bottoms'],
    queryFn: () => listBottoms(),
  });

  return serializeQueryResult(result);
}
