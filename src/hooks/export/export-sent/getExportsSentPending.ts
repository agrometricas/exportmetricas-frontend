/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { useQuery } from '@tanstack/react-query';
import { AxiosResponse } from 'axios';
import axios from '@/lib/axios';
import { serializeQueryResult } from '@/utils/serializeQueryResult';

function listExportsSentPending(): Promise<AxiosResponse> {
  return axios.get('/export/export-sent/pending');
}

export function useExportsSentPending() {
  const result = useQuery({
    queryKey: ['exportsSentPending'],
    queryFn: () => listExportsSentPending(),
  });

  return serializeQueryResult(result);
}
