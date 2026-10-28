import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { AxiosResponse } from 'axios';
import axios from '@/lib/axios';
import { CoverType } from '@/types/box-brand/materials/cover';
import { serializeQueryResult } from '@/utils/serializeQueryResult';

function listCovers(): Promise<AxiosResponse<CoverType[]>> {
  return axios.get('/box-brand/cover');
}

export function useCovers(): UseQueryResult<CoverType[], unknown> {
  const result = useQuery({
    queryKey: ['covers'],
    queryFn: () => listCovers(),
  });
  return serializeQueryResult(result);
}
