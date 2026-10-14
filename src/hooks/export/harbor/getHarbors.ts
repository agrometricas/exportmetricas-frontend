import { AxiosResponse } from 'axios';
import { useQuery } from 'react-query';
import axios from '@/lib/axios';
import { PaginationParams } from '@/types/paginationParams';
import { serializeQueryResult } from '@/utils/serializeQueryResult';
import { HarborResponse } from '../../../types/harbor.response';

type Params = PaginationParams;

function listHarbors(params: Params): Promise<AxiosResponse<HarborResponse[]>> {
  return axios.get('/harbor', { params });
}

export function useHarbors({ search = '', page = 1, limit = 10 }: Params): ReturnType<typeof serializeQueryResult> {
  const result = useQuery(
    ['harbors', search, page, limit],
    () => listHarbors({ search, page, limit }),
    {
      keepPreviousData: true,
    }
  );

  return serializeQueryResult(result);
}
