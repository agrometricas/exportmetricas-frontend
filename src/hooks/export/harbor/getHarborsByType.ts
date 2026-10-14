/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { AxiosResponse } from 'axios';
import { useQuery } from 'react-query';
import axios from '@/lib/axios';
import { PaginationParams } from '@/types/paginationParams';
import { serializeQueryResult } from '@/utils/serializeQueryResult';

type Params = PaginationParams;

interface listHarborsProps {
  params: Params;
  type: string | 'Nacional' | 'Internacional';
}

function listHarborsByType({
  params,
  type,
}: listHarborsProps): Promise<AxiosResponse> {
  return axios.get(`/harbor/type/${type}`, { params });
}

interface useHarborsProps extends Params {
  type: string | 'Nacional' | 'Internacional';
}

export function useHarborsByType({
  search = '',
  page = 1,
  limit = 10,
  type,
}: useHarborsProps) {
  const result = useQuery(
    ['harborsByType', search, page, limit, type],
    () => listHarborsByType({ params: { search, page, limit }, type }),
    {
      keepPreviousData: true,
    }
  );

  return serializeQueryResult(result);
}
