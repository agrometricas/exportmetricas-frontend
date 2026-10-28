import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { AxiosResponse } from 'axios';
import axios from '@/lib/axios';
import { SachetType } from '@/types/box-brand/materials/sachet';
import { serializeQueryResult } from '@/utils/serializeQueryResult';

function listSachets(): Promise<AxiosResponse<SachetType[]>> {
  return axios.get('/box-brand/sachet');
}

export function useSachets(): UseQueryResult<SachetType[], unknown> {
  const result = useQuery({
    queryKey: ['sachets'],
    queryFn: () => listSachets(),
  });

  return serializeQueryResult(result);
}
