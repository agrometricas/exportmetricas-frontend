/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { useQuery } from '@tanstack/react-query';
import { AxiosResponse } from 'axios';
import axios from '@/lib/axios';
import { serializeQueryResult } from '@/utils/serializeQueryResult';

function listCuttingSheetsPending(): Promise<AxiosResponse> {
  return axios.get('/export/cutting-sheet/pending');
}

export function useCuttingSheetsPending() {
  const result = useQuery({
    queryKey: ['cuttingSheetsPending'],
    queryFn: () => listCuttingSheetsPending(),
  });

  return serializeQueryResult(result);
}
