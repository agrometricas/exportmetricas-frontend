import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { AxiosResponse } from 'axios';
import axios from '../../../lib/axios';
import { CuttingType } from '../../../types/cuttingType';
import { serializeQueryResult } from '../../../utils/serializeQueryResult';

function getCuttingType(id: string): Promise<AxiosResponse<CuttingType>> {
  return axios.get(`/cutting-type/${id}`);
}

export function useCuttingType(
  id: string
): UseQueryResult<CuttingType, unknown> {
  return serializeQueryResult(
    useQuery({
      queryKey: ['cuttingType', id],
      queryFn: () => getCuttingType(id),
      enabled: Boolean(id),
    })
  );
}
