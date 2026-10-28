import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { AxiosResponse } from 'axios';
import axios from '@/lib/axios';
import { qk } from '@/lib/queryKeys';
import { ProtectorType } from '@/types/box-brand/materials/protector';
import { serializeQueryResult } from '@/utils/serializeQueryResult';

function listProtectors(): Promise<AxiosResponse<ProtectorType[]>> {
  return axios.get('/box-brand/protector');
}

export function useProtectors(): UseQueryResult<ProtectorType[], unknown> {
  const result = useQuery({
    queryKey: qk('protectors'),
    queryFn: () => listProtectors(),
  });

  return serializeQueryResult(result);
}
