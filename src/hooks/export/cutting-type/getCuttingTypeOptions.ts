import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { AxiosResponse } from 'axios';
import axios from '@/lib/axios';
import { qk } from '@/lib/queryKeys';
import { CuttingTypeOptions } from '@/types/cuttingType';
import { serializeQueryResult } from '@/utils/serializeQueryResult';

function getCuttingTypeOptions(): Promise<AxiosResponse<CuttingTypeOptions>> {
  return axios.get('/cutting-type/options');
}

export function useCuttingTypeOptions(): UseQueryResult<
  CuttingTypeOptions,
  unknown
> {
  return serializeQueryResult(
    useQuery({
      queryKey: qk('cuttingTypeOptions'),
      queryFn: getCuttingTypeOptions,
    })
  );
}
