import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { AxiosResponse } from 'axios';
import axios from '@/lib/axios';
import { CornerType } from '@/types/box-brand/materials/corner';
import { serializeQueryResult } from '@/utils/serializeQueryResult';

function listCorners(): Promise<AxiosResponse<CornerType[]>> {
  return axios.get('/box-brand/corner');
}

export function useCorners(): UseQueryResult<CornerType[], unknown> {
  const result = useQuery({
    queryKey: ['corners'],
    queryFn: () => listCorners(),
  });
  return serializeQueryResult(result);
}
