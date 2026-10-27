import {
  keepPreviousData,
  UseQueryResult,
  useQuery,
} from '@tanstack/react-query';
import { AxiosResponse } from 'axios';
import axios from '@/lib/axios';
import { QueryConfig } from '@/lib/react-query';
import { serializeQueryResult } from '@/utils/serializeQueryResult';
import { ExportResponse } from '../../types/export.response';

export const getExport = ({
  exportId,
}: {
  exportId: string;
}): Promise<AxiosResponse> => {
  return axios.get(`/export/${exportId}`);
};

type QueryFnType = typeof getExport;

type UseExportOptions = {
  exportId: string;
  config?: QueryConfig<QueryFnType>;
};

export const useExport = ({
  exportId,
}: UseExportOptions): UseQueryResult<ExportResponse> => {
  const result = useQuery({
    queryKey: ['export', exportId],
    queryFn: () => getExport({ exportId }),
    placeholderData: keepPreviousData,
  });

  return serializeQueryResult(result) as UseQueryResult<ExportResponse>;
};
