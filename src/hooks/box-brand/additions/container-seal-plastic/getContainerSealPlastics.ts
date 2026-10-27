import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { AxiosResponse } from 'axios';
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
  const result = useQuery({
    queryKey: ['containerSealPlastics', search, page, limit],
    queryFn: () => listContainerSealPlastics({ search, page, limit }),
    placeholderData: keepPreviousData,
  });

  return serializeQueryResult(result);
}
