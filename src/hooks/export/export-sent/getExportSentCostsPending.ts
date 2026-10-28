import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { AxiosResponse } from 'axios';
import axios from '@/lib/axios';
import { qk } from '@/lib/queryKeys';
import { ExportSentType } from '@/types/exportSent';
import { serializeQueryResult } from '@/utils/serializeQueryResult';

function listExportSentCostsPending(): Promise<
  AxiosResponse<Partial<ExportSentType>[]>
> {
  return axios.get('export-sent/pending-costs');
}

export function useExportSentCostsPending(): UseQueryResult<
  Partial<ExportSentType>[],
  unknown
> {
  const result = useQuery({
    queryKey: qk('exportSentCostsPending'),
    queryFn: () => listExportSentCostsPending(),
  });

  return serializeQueryResult(result);
}
