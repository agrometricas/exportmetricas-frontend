import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { AxiosResponse } from 'axios';
import axios from '@/lib/axios';
import { PaginationParams } from '@/types/paginationParams';
import { serializeQueryResult } from '@/utils/serializeQueryResult';

type Params = PaginationParams;

function listBoardingCards(params: Params): Promise<AxiosResponse> {
  return axios.get('/box-brand/boarding-card', { params });
}

export function useBoardingCards({
  search = '',
  page = 1,
  limit = 10,
}: Params): ReturnType<typeof serializeQueryResult> {
  const result = useQuery({
    queryKey: ['boardingCards', search, page, limit],
    queryFn: () => listBoardingCards({ search, page, limit }),
    placeholderData: keepPreviousData,
  });

  return serializeQueryResult(result);
}
