/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { AxiosResponse } from 'axios';
import { useQuery } from 'react-query';
import axios from '@/lib/axios';
import { PaginationParams } from '@/types/paginationParams';
import { serializeQueryResult } from '@/utils/serializeQueryResult';

type Params = PaginationParams;

function listCuttingSheets(params: Params): Promise<AxiosResponse> {
  return axios.get('/export/cutting-sheets', { params });
}

export function useCuttingSheets({
  search = '',
  page = 1,
  limit = 10,
}: Params) {
  const result = useQuery(
    ['cuttingSheets', search, page, limit],
    () => listCuttingSheets({ search, page, limit }),
    {
      keepPreviousData: true,
    }
  );

  return serializeQueryResult(result);
}
