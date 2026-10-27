/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { AxiosResponse } from 'axios';
import axios from '@/lib/axios';
import { serializeQueryResult } from '@/utils/serializeQueryResult';

type HarborType = string | 'Nacional' | 'Internacional';

function listHarborsByType(type: HarborType): Promise<AxiosResponse> {
  return axios.get(`/harbor/type/${type}`);
}

export function useHarborsByType({ type }: { type: HarborType }) {
  const result = useQuery({
    queryKey: ['harborsByType', type],
    queryFn: () => listHarborsByType(type),
    placeholderData: keepPreviousData,
  });

  return serializeQueryResult(result);
}
