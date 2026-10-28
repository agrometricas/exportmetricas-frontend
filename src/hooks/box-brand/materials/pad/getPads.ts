import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { AxiosResponse } from 'axios';
import axios from '@/lib/axios';
import { qk } from '@/lib/queryKeys';
import { PadType } from '@/types/box-brand/materials/pad';
import { serializeQueryResult } from '@/utils/serializeQueryResult';

function listPads(): Promise<AxiosResponse<PadType[]>> {
  return axios.get('/box-brand/pad');
}

export function usePads(): UseQueryResult<PadType[], unknown> {
  const result = useQuery({
    queryKey: qk('pads'),
    queryFn: () => listPads(),
  });
  return serializeQueryResult(result);
}
