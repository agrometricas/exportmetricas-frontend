import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { AxiosResponse } from 'axios';
import axios from '@/lib/axios';
import { qk } from '@/lib/queryKeys';
import { PesticideType } from '@/types/box-brand/post-harvest/pesticide';
import { serializeQueryResult } from '@/utils/serializeQueryResult';

function listPesticides(): Promise<AxiosResponse<PesticideType[]>> {
  return axios.get('/box-brand/pesticide');
}

export function usePesticides(): UseQueryResult<PesticideType[], unknown> {
  const result = useQuery({
    queryKey: qk('pesticides'),
    queryFn: () => listPesticides(),
  });

  return serializeQueryResult(result);
}
