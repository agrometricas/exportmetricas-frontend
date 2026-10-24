import { AxiosResponse } from 'axios';
import { useQuery } from 'react-query';
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
    useQuery(['cuttingTypeOptions'], getCuttingTypeOptions)
  );
}
