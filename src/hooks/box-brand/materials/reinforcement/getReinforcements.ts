import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { AxiosResponse } from 'axios';
import axios from '@/lib/axios';
import { qk } from '@/lib/queryKeys';
import { ReinforcementType } from '@/types/box-brand/materials/reinforcement';
import { serializeQueryResult } from '@/utils/serializeQueryResult';

function listReinforcements(): Promise<AxiosResponse<ReinforcementType[]>> {
  return axios.get('/box-brand/reinforcement');
}

export function useReinforcements(): UseQueryResult<
  ReinforcementType[],
  unknown
> {
  const result = useQuery({
    queryKey: qk('reinforcements'),
    queryFn: () => listReinforcements(),
  });
  return serializeQueryResult(result);
}
