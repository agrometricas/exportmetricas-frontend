import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { AxiosResponse } from 'axios';
import axios from '@/lib/axios';
import { qk } from '@/lib/queryKeys';
import { CuttingType } from '@/types/cuttingType';
import { serializeQueryResult } from '@/utils/serializeQueryResult';

function listCuttingTypes(): Promise<AxiosResponse<CuttingType[]>> {
  return axios.get('/cutting-type');
}

export function useCuttingTypes(): UseQueryResult<CuttingType[], unknown> {
  const result = useQuery({
    queryKey: qk('cuttingTypes'),
    queryFn: () => listCuttingTypes(),
  });

  return serializeQueryResult(result);
}
