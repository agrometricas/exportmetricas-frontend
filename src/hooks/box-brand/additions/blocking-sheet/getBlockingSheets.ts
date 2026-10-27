import { useQuery } from '@tanstack/react-query';
import { AxiosResponse } from 'axios';
import axios from '@/lib/axios';
import { serializeQueryResult } from '@/utils/serializeQueryResult';

function listBlockingSheets(): Promise<AxiosResponse> {
  return axios.get('/box-brand/blocking-sheet');
}

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/explicit-function-return-type
export function useBlockingSheets() {
  const result = useQuery({
    queryKey: ['blockingSheets'],
    queryFn: () => listBlockingSheets(),
  });

  return serializeQueryResult(result);
}
