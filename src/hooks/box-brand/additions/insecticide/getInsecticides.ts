import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { AxiosResponse } from 'axios';
import axios from '@/lib/axios';
import { qk } from '@/lib/queryKeys';
import { InsecticideType } from '@/types/box-brand/additions/insecticide';
import { serializeQueryResult } from '@/utils/serializeQueryResult';

function listInsecticides(): Promise<AxiosResponse<InsecticideType[]>> {
  return axios.get('/box-brand/insecticide');
}

export function useInsecticides(): UseQueryResult<InsecticideType[], unknown> {
  const result = useQuery({
    queryKey: qk('insecticides'),
    queryFn: () => listInsecticides(),
  });

  return serializeQueryResult(result);
}
