import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { AxiosResponse } from 'axios';
import axios from '@/lib/axios';
import { BandType } from '@/types/box-brand/materials/band';
import { serializeQueryResult } from '@/utils/serializeQueryResult';

function listBands(): Promise<AxiosResponse<BandType[]>> {
  return axios.get('/box-brand/band');
}

export function useBands(): UseQueryResult<BandType[], unknown> {
  const result = useQuery({
    queryKey: ['bands'],
    queryFn: () => listBands(),
  });

  return serializeQueryResult(result);
}
