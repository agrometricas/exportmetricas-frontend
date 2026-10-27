import { useQuery } from '@tanstack/react-query';
import { AxiosResponse } from 'axios';
import axios from '@/lib/axios';
import { CuttingTypeOptions } from '@/types/cuttingType';
import { serializeQueryResult } from '@/utils/serializeQueryResult';

function getCuttingTypeOptions(): Promise<AxiosResponse<CuttingTypeOptions>> {
  return axios.get('/cutting-type/options');
}

export function useCuttingTypeOptions(): ReturnType<
  typeof serializeQueryResult
> {
  return serializeQueryResult(
    useQuery({
      queryKey: ['cuttingTypeOptions'],
      queryFn: getCuttingTypeOptions,
    })
  );
}
