import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { AxiosResponse } from 'axios';
import axios from '@/lib/axios';
import { MettoLabelType } from '@/types/box-brand/container/mettoLabel';
import { serializeQueryResult } from '@/utils/serializeQueryResult';

function listMettoLabels(): Promise<AxiosResponse<MettoLabelType[]>> {
  return axios.get('/box-brand/metto-label');
}

export function useMettoLabels(): UseQueryResult<MettoLabelType[], unknown> {
  const result = useQuery({
    queryKey: ['mettoLabels'],
    queryFn: () => listMettoLabels(),
  });

  return serializeQueryResult(result);
}
