import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { AxiosResponse } from 'axios';
import axios from '@/lib/axios';
import { ExportSentType } from '@/types/exportSent';
import { serializeQueryResult } from '@/utils/serializeQueryResult';

function listExportsSentPending(): Promise<
  AxiosResponse<Partial<ExportSentType>[]>
> {
  return axios.get('/export/export-sent/pending');
}

export function useExportsSentPending(): UseQueryResult<
  Partial<ExportSentType>[],
  unknown
> {
  const result = useQuery({
    queryKey: ['exportsSentPending'],
    queryFn: () => listExportsSentPending(),
  });

  return serializeQueryResult(result);
}
