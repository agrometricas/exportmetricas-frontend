import { useQuery } from '@tanstack/react-query';
import { AxiosResponse } from 'axios';
import axios from '@/lib/axios';
import { serializeQueryResult } from '@/utils/serializeQueryResult';

function listInsecticides(): Promise<AxiosResponse> {
  return axios.get('/box-brand/insecticide');
}

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/explicit-function-return-type
export function useInsecticides() {
  const result = useQuery({
    queryKey: ['insecticides'],
    queryFn: () => listInsecticides(),
  });

  return serializeQueryResult(result);
}
