import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { AxiosResponse } from 'axios';
import axios from '@/lib/axios';
import { BoardingCardType } from '@/types/box-brand/additions/boardingCard';
import { serializeQueryResult } from '@/utils/serializeQueryResult';

function listBoardingCards(): Promise<AxiosResponse<BoardingCardType[]>> {
  return axios.get('/box-brand/boarding-card');
}

export function useBoardingCards(): UseQueryResult<
  BoardingCardType[],
  unknown
> {
  const result = useQuery({
    queryKey: ['boardingCards'],
    queryFn: () => listBoardingCards(),
  });

  return serializeQueryResult(result);
}
