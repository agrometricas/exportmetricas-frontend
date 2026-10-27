import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { AxiosResponse } from 'axios';
import axios from '@/lib/axios';
import { PaginationParams } from '@/types/paginationParams';
import { serializeQueryResult } from '@/utils/serializeQueryResult';
import { HarborResponse } from '../../../types/harbor.response';

type Params = PaginationParams;

function listHarbors(params: Params): Promise<AxiosResponse<HarborResponse[]>> {
  return axios.get('/harbor', { params });
}

export function useHarbors({ search = '', page = 1, limit = 10 }: Params): ReturnType<typeof serializeQueryResult> {
  const result = useQuery({
    queryKey: ['harbors', search, page, limit],
    queryFn: () => listHarbors({ search, page, limit }),
    placeholderData: keepPreviousData
  });

  return serializeQueryResult(result);
}
