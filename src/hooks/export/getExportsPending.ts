import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { AxiosResponse } from 'axios';
import { qk } from '@/lib/queryKeys';
import { ExportType } from '@/types/export';
import axios from '../../lib/axios';
import { serializeQueryResult } from '../../utils/serializeQueryResult';

function listExportsPending(): Promise<AxiosResponse<ExportType[]>> {
  return axios.get('/export/pending');
}

export function useExportsPending(): UseQueryResult<ExportType[], unknown> {
  const result = useQuery({
    queryKey: qk('exportsPending'),
    queryFn: () => listExportsPending(),
  });

  return serializeQueryResult(result);
}
