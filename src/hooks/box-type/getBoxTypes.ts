import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { AxiosResponse } from 'axios';
import { qk } from '@/lib/queryKeys';
import axios from '../../lib/axios';
import { BoxTypeResponse } from '../../types/boxType';
import { serializeQueryResult } from '../../utils/serializeQueryResult';

function listBoxTypes(): Promise<AxiosResponse<BoxTypeResponse[]>> {
  return axios.get('/box-types');
}

export function useBoxTypes(): UseQueryResult<BoxTypeResponse[], unknown> {
  return serializeQueryResult(
    useQuery({
      queryKey: qk('boxTypes'),
      queryFn: listBoxTypes,
    })
  );
}
