import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { AxiosResponse } from 'axios';
import axios from '@/lib/axios';
import { PaginationParams } from '@/types/paginationParams';
import { serializeQueryResult } from '@/utils/serializeQueryResult';

type Params = PaginationParams;

function listBlockingSheets(params: Params): Promise<AxiosResponse> {
  return axios.get('/box-brand/blocking-sheet', { params });
}

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/explicit-function-return-type
export function useBlockingSheets({
  search = '',
  page = 1,
  limit = 10,
}: Params) {
  const result = useQuery({
    queryKey: ['blockingSheets', search, page, limit],
    queryFn: () => listBlockingSheets({ search, page, limit }),
    placeholderData: keepPreviousData,
  });

  return serializeQueryResult(result);
}
