import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { AxiosResponse } from 'axios';
import axios from '@/lib/axios';
import { PaginationParams } from '@/types/paginationParams';
import { serializeQueryResult } from '@/utils/serializeQueryResult';

type Params = PaginationParams;

function listExportSentCostsPending(params: Params): Promise<AxiosResponse> {
  return axios.get('export-sent/pending-costs', { params });
}

export function useExportSentCostsPending({
  search = '',
  page = 1,
  limit = 10,
}: Params): ReturnType<typeof serializeQueryResult> {
  const result = useQuery({
    queryKey: ['exportSentCostsPending', search, page, limit],
    queryFn: () => listExportSentCostsPending({ search, page, limit }),
    placeholderData: keepPreviousData,
  });

  return serializeQueryResult(result);
}
