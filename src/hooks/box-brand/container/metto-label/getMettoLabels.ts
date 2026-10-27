/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { AxiosResponse } from 'axios';
import axios from '@/lib/axios';
import { PaginationParams } from '@/types/paginationParams';
import { serializeQueryResult } from '@/utils/serializeQueryResult';

type Params = PaginationParams;

function listMettoLabels(params: Params): Promise<AxiosResponse> {
  return axios.get('/box-brand/metto-label', { params });
}

export function useMettoLabels({ search = '', page = 1, limit = 10 }: Params) {
  const result = useQuery({
    queryKey: ['mettoLabels', search, page, limit],
    queryFn: () => listMettoLabels({ search, page, limit }),
    placeholderData: keepPreviousData,
  });

  return serializeQueryResult(result);
}
