import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { AxiosResponse } from 'axios';
import axios from '@/lib/axios';
import { SpongeType } from '@/types/box-brand/materials/sponge';
import { serializeQueryResult } from '@/utils/serializeQueryResult';

function listSponges(): Promise<AxiosResponse<SpongeType[]>> {
  return axios.get('/box-brand/sponge');
}

export function useSponges(): UseQueryResult<SpongeType[], unknown> {
  const result = useQuery({
    queryKey: ['sponges'],
    queryFn: () => listSponges(),
  });
  return serializeQueryResult(result);
}
