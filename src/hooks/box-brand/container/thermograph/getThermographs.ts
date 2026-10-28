import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { AxiosResponse } from 'axios';
import axios from '@/lib/axios';
import { qk } from '@/lib/queryKeys';
import { ThermographType } from '@/types/box-brand/container/thermograph';
import { serializeQueryResult } from '@/utils/serializeQueryResult';

function listThermographs(): Promise<AxiosResponse<ThermographType[]>> {
  return axios.get('/box-brand/thermograph');
}

export function useThermographs(): UseQueryResult<ThermographType[], unknown> {
  const result = useQuery({
    queryKey: qk('thermographs'),
    queryFn: () => listThermographs(),
  });

  return serializeQueryResult(result);
}
