import { AxiosResponse } from 'axios';
import { useQuery } from 'react-query';
import axios from '../../../lib/axios';
import { CuttingType } from '../../../types/cuttingType';
import { serializeQueryResult } from '../../../utils/serializeQueryResult';

function getCuttingType(id: string): Promise<AxiosResponse<CuttingType>> {
  return axios.get(`/cutting-type/${id}`);
}

export function useCuttingType(
  id: string
): ReturnType<typeof serializeQueryResult> {
  return serializeQueryResult(
    useQuery(['cuttingType', id], () => getCuttingType(id), {
      enabled: Boolean(id),
    })
  );
}
