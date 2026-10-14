/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { AxiosResponse } from 'axios';
import { useQuery } from 'react-query';
import axios from '@/lib/axios';
import { PaginationParams } from '@/types/paginationParams';
import { serializeQueryResult } from '@/utils/serializeQueryResult';

type Params = PaginationParams;

function listReinforcements(params: Params): Promise<AxiosResponse> {
  return axios.get('/box-brand/reinforcement', { params });
}

export function useReinforcements({
  search = '',
  page = 1,
  limit = 10,
}: Params) {
  const result = useQuery(
    ['reinforcements', search, page, limit],
    () => listReinforcements({ search, page, limit }),
    {
      keepPreviousData: true,
    }
  );
  return serializeQueryResult(result);
}
