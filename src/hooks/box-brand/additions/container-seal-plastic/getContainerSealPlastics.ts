import { AxiosResponse } from 'axios';
import { useQuery } from 'react-query';
import axios from '@/lib/axios';
import { PaginationParams } from '@/types/paginationParams';
import { serializeQueryResult } from '@/utils/serializeQueryResult';

type Params = PaginationParams;

function listContainerSealPlastics(params: Params): Promise<AxiosResponse> {
  return axios.get('/box-brand/container-seal-plastic', { params });
}

export function useContainerSealPlastics({
  search = '',
  page = 1,
  limit = 10,
}: Params): ReturnType<typeof serializeQueryResult> {
  const result = useQuery(
    ['containerSealPlastics', search, page, limit],
    () => listContainerSealPlastics({ search, page, limit }),
    {
      keepPreviousData: true,
    }
  );

  return serializeQueryResult(result);
}
