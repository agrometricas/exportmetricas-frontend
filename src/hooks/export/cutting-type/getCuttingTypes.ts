/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { useQuery } from '@tanstack/react-query';
import { AxiosResponse } from 'axios';
import axios from '@/lib/axios';
import { serializeQueryResult } from '@/utils/serializeQueryResult';

function listCuttingTypes(): Promise<AxiosResponse> {
  return axios.get('/cutting-type');
}

export function useCuttingTypes() {
  const result = useQuery({
    queryKey: ['cuttingTypes'],
    queryFn: () => listCuttingTypes(),
  });

  return serializeQueryResult(result);
}
