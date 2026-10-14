import { AxiosResponse } from 'axios';
import { useQuery } from 'react-query';
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
  const result = useQuery(
    ['blockingSheets', search, page, limit],
    () => listBlockingSheets({ search, page, limit }),
    {
      keepPreviousData: true,
    }
  );

  return serializeQueryResult(result);
}
