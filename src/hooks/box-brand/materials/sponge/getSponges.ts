/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { useQuery } from '@tanstack/react-query';
import { AxiosResponse } from 'axios';
import axios from '@/lib/axios';
import { serializeQueryResult } from '@/utils/serializeQueryResult';

function listSponges(): Promise<AxiosResponse> {
  return axios.get('/box-brand/sponge');
}

export function useSponges() {
  const result = useQuery({
    queryKey: ['sponges'],
    queryFn: () => listSponges(),
  });
  return serializeQueryResult(result);
}
