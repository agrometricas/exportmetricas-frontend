import { useQuery } from '@tanstack/react-query';
import { AxiosResponse } from 'axios';
import axios from '@/lib/axios';
import { serializeQueryResult } from '@/utils/serializeQueryResult';

function listExportSentCostsPending(): Promise<AxiosResponse> {
  return axios.get('export-sent/pending-costs');
}

export function useExportSentCostsPending(): ReturnType<
  typeof serializeQueryResult
> {
  const result = useQuery({
    queryKey: ['exportSentCostsPending'],
    queryFn: () => listExportSentCostsPending(),
  });

  return serializeQueryResult(result);
}
