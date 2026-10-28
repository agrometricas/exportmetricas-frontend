import {
  keepPreviousData,
  useQuery,
  UseQueryResult,
} from '@tanstack/react-query';
import { AxiosResponse } from 'axios';
import axios from '@/lib/axios';
import { qk } from '@/lib/queryKeys';
import { HarborType } from '@/types/harbor';
import { serializeQueryResult } from '@/utils/serializeQueryResult';

type HarborKind = string | 'Nacional' | 'Internacional';

function listHarborsByType(
  type: HarborKind
): Promise<AxiosResponse<HarborType[]>> {
  return axios.get(`/harbor/type/${type}`);
}

export function useHarborsByType({
  type,
}: {
  type: HarborKind;
}): UseQueryResult<HarborType[], unknown> {
  const result = useQuery({
    queryKey: qk('harborsByType', type),
    queryFn: () => listHarborsByType(type),
    placeholderData: keepPreviousData,
  });

  return serializeQueryResult(result);
}
