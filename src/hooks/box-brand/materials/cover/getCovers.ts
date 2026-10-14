/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { AxiosResponse } from 'axios';
import { useQuery } from 'react-query';
import axios from '@/lib/axios';
import { PaginationParams } from '@/types/paginationParams';
import { serializeQueryResult } from '@/utils/serializeQueryResult';

type Params = PaginationParams;

function listCovers(params: Params): Promise<AxiosResponse> {
  return axios.get('/box-brand/cover', { params });
}

export function useCovers({ search = '', page = 1, limit = 10 }: Params) {
  const result = useQuery(
    ['covers', search, page, limit],
    () => listCovers({ search, page, limit }),
    {
      keepPreviousData: true,
    }
  );
  return serializeQueryResult(result);
}
