import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { AxiosResponse } from 'axios';
import axios from '@/lib/axios';
import { qk } from '@/lib/queryKeys';
import { SheetType } from '@/types/box-brand/additions/sheet';
import { serializeQueryResult } from '@/utils/serializeQueryResult';

function listSheets(): Promise<AxiosResponse<SheetType[]>> {
  return axios.get('/box-brand/sheet');
}

export function useSheets(): UseQueryResult<SheetType[], unknown> {
  const result = useQuery({
    queryKey: qk('sheets'),
    queryFn: () => listSheets(),
  });

  return serializeQueryResult(result);
}
