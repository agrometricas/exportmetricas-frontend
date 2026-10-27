import { useQuery } from '@tanstack/react-query';
import { AxiosResponse } from 'axios';
import axios from '@/lib/axios';
import { serializeQueryResult } from '@/utils/serializeQueryResult';

function listBoardingCards(): Promise<AxiosResponse> {
  return axios.get('/box-brand/boarding-card');
}

export function useBoardingCards(): ReturnType<typeof serializeQueryResult> {
  const result = useQuery({
    queryKey: ['boardingCards'],
    queryFn: () => listBoardingCards(),
  });

  return serializeQueryResult(result);
}
