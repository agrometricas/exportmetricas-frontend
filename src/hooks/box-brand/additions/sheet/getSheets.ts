import { useQuery } from '@tanstack/react-query';
import { AxiosResponse } from 'axios';
import axios from '@/lib/axios';
import { serializeQueryResult } from '@/utils/serializeQueryResult';

function listSheets(): Promise<AxiosResponse> {
  return axios.get('/box-brand/sheet');
}

export function useSheets(): ReturnType<typeof serializeQueryResult> {
  const result = useQuery({
    queryKey: ['sheets'],
    queryFn: () => listSheets(),
  });

  return serializeQueryResult(result);
}
