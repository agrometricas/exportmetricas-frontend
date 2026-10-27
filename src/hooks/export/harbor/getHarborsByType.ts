/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { AxiosResponse } from 'axios';
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
  const result = useQuery({
    queryKey: ['harborsByType', search, page, limit, type],
    queryFn: () => listHarborsByType({ params: { search, page, limit }, type }),
    placeholderData: keepPreviousData,
  });

  return serializeQueryResult(result);
}
