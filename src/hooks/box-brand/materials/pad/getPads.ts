import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { AxiosResponse } from 'axios';
import axios from '@/lib/axios';
import { PadType } from '@/types/box-brand/materials/pad';
import { serializeQueryResult } from '@/utils/serializeQueryResult';

function listPads(): Promise<AxiosResponse<PadType[]>> {
  return axios.get('/box-brand/pad');
}

export function usePads(): UseQueryResult<PadType[], unknown> {
  const result = useQuery({
    queryKey: ['pads'],
    queryFn: () => listPads(),
  });
  return serializeQueryResult(result);
}
