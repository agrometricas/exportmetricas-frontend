import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { AxiosResponse } from 'axios';
import axios from '@/lib/axios';
import { LabelType } from '@/types/box-brand/materials/label';
import { serializeQueryResult } from '@/utils/serializeQueryResult';

function listLabels(): Promise<AxiosResponse<LabelType[]>> {
  return axios.get('/box-brand/label');
}

export function useLabels(): UseQueryResult<LabelType[], unknown> {
  const result = useQuery({
    queryKey: ['labels'],
    queryFn: () => listLabels(),
  });

  return serializeQueryResult(result);
}
