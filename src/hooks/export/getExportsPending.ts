/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { useQuery } from '@tanstack/react-query';
import { AxiosResponse } from 'axios';
import axios from '../../lib/axios';
import { serializeQueryResult } from '../../utils/serializeQueryResult';

function listExportsPending(): Promise<AxiosResponse> {
  return axios.get('/export/pending');
}

export function useExportsPending() {
  const result = useQuery({
    queryKey: ['exportsPending'],
    queryFn: () => listExportsPending(),
  });

  return serializeQueryResult(result);
}
