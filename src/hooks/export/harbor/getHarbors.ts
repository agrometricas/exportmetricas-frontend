import { useQuery } from '@tanstack/react-query';
import { AxiosResponse } from 'axios';
import axios from '@/lib/axios';
import { serializeQueryResult } from '@/utils/serializeQueryResult';
import { HarborResponse } from '../../../types/harbor.response';

function listHarbors(): Promise<AxiosResponse<HarborResponse[]>> {
  return axios.get('/harbor');
}

export function useHarbors(): ReturnType<typeof serializeQueryResult> {
  const result = useQuery({
    queryKey: ['harbors'],
    queryFn: () => listHarbors(),
  });

  return serializeQueryResult(result);
}
