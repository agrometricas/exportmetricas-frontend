import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { AxiosResponse } from 'axios';
import axios from '@/lib/axios';
import { qk } from '@/lib/queryKeys';
import { BlockingSheetType } from '@/types/box-brand/additions/blockingSheet';
import { serializeQueryResult } from '@/utils/serializeQueryResult';

function listBlockingSheets(): Promise<AxiosResponse<BlockingSheetType[]>> {
  return axios.get('/box-brand/blocking-sheet');
}

export function useBlockingSheets(): UseQueryResult<
  BlockingSheetType[],
  unknown
> {
  const result = useQuery({
    queryKey: qk('blockingSheets'),
    queryFn: () => listBlockingSheets(),
  });

  return serializeQueryResult(result);
}
