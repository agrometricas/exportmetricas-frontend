import { AxiosResponse } from 'axios';
import { useQuery } from 'react-query';
import axios from '../../lib/axios';
import { BoxTypeResponse } from '../../types/boxType';
import { serializeQueryResult } from '../../utils/serializeQueryResult';

function listBoxTypes(): Promise<AxiosResponse<BoxTypeResponse[]>> {
  return axios.get('/box-types');
}

export function useBoxTypes(): ReturnType<typeof serializeQueryResult> {
  return serializeQueryResult(useQuery(['boxTypes'], listBoxTypes));
}
