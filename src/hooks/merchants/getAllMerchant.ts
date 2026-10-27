/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { useQuery } from '@tanstack/react-query';
import { AxiosResponse } from 'axios';
import axios from '../../lib/axios';
import { serializeQueryResult } from '../../utils/serializeQueryResult';

function listProducers(): Promise<AxiosResponse> {
  return axios.get('/merchant');
}

export function useProducers() {
  const result = useQuery({
    queryKey: ['producers'],
    queryFn: () => listProducers(),
  });

  return serializeQueryResult(result);
}
