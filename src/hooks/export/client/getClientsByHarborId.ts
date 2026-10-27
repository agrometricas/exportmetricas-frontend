/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { AxiosResponse } from 'axios';
import axios from '@/lib/axios';
import { serializeQueryResult } from '@/utils/serializeQueryResult';

interface Body {
  id: number;
}

function listClientsByHarborId(body: Body): Promise<AxiosResponse> {
  return axios.get(`/client/harbor/${body.id}`);
}

export function useClientsByHarborId({ id }: Body) {
  const result = useQuery({
    queryKey: ['clientsByHarbor', id],
    queryFn: () => listClientsByHarborId({ id }),
    placeholderData: keepPreviousData,
  });

  return serializeQueryResult(result);
}
