import {
  keepPreviousData,
  UseQueryResult,
  useQuery,
} from '@tanstack/react-query';
import { AxiosResponse } from 'axios';
import axios from '@/lib/axios';
import { qk } from '@/lib/queryKeys';
import { QueryConfig } from '@/lib/react-query';
import { ExportSentType } from '@/types/exportSent';
import { serializeQueryResult } from '@/utils/serializeQueryResult';

export const getExportSent = ({
  exportSentId,
}: {
  exportSentId: string;
}): Promise<AxiosResponse> => {
  return axios.get(`/export/export-sent/${exportSentId}`);
};

type QueryFnType = typeof getExportSent;

type UseExportSentOptions = {
  exportSentId: string;
  config?: QueryConfig<QueryFnType>;
};

export const useExportSent = ({
  exportSentId,
}: UseExportSentOptions): UseQueryResult<ExportSentType> => {
  const result = useQuery({
    queryKey: qk('exportSent', exportSentId),
    queryFn: () => getExportSent({ exportSentId }),
    enabled: !!exportSentId,
    placeholderData: keepPreviousData,
  });

  return serializeQueryResult(result) as UseQueryResult<ExportSentType>;
};
