import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { AxiosResponse } from 'axios';
import axios from '@/lib/axios';
import { RubberType } from '@/types/box-brand/materials/rubber';
import { serializeQueryResult } from '@/utils/serializeQueryResult';

function listRubbers(): Promise<AxiosResponse<RubberType[]>> {
  return axios.get('/box-brand/rubber');
}

export function useRubbers(): UseQueryResult<RubberType[], unknown> {
  const result = useQuery({
    queryKey: ['rubbers'],
    queryFn: () => listRubbers(),
  });

  return serializeQueryResult(result);
}
