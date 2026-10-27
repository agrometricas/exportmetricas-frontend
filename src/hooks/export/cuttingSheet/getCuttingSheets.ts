/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { AxiosResponse } from 'axios';
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
  const result = useQuery({
    queryKey: ['cuttingSheets', search, page, limit],
    queryFn: () => listCuttingSheets({ search, page, limit }),
    placeholderData: keepPreviousData,
  });

  return serializeQueryResult(result);
}
