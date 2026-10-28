import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { AxiosResponse } from 'axios';
import axios from '@/lib/axios';
import { qk } from '@/lib/queryKeys';
import { StrippingType } from '@/types/box-brand/container/stripping';
import { serializeQueryResult } from '@/utils/serializeQueryResult';

function listStrippings(): Promise<AxiosResponse<StrippingType[]>> {
  return axios.get('/box-brand/stripping');
}

export function useStrippings(): UseQueryResult<StrippingType[], unknown> {
  const result = useQuery({
    queryKey: qk('strippings'),
    queryFn: () => listStrippings(),
  });

  return serializeQueryResult(result);
}
