import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { AxiosResponse } from 'axios';
import axios from '@/lib/axios';
import { qk } from '@/lib/queryKeys';
import { ExportSentType } from '@/types/exportSent';
import { serializeQueryResult } from '@/utils/serializeQueryResult';

function listCuttingSheetsPending(): Promise<
  AxiosResponse<Partial<ExportSentType>[]>
> {
  return axios.get('/export/cutting-sheet/pending');
}

export function useCuttingSheetsPending(): UseQueryResult<
  Partial<ExportSentType>[],
  unknown
> {
  const result = useQuery({
    queryKey: qk('cuttingSheetsPending'),
    queryFn: () => listCuttingSheetsPending(),
  });

  return serializeQueryResult(result);
}
