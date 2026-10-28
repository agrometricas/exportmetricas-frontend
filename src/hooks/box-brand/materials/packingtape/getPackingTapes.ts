import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { AxiosResponse } from 'axios';
import axios from '@/lib/axios';
import { qk } from '@/lib/queryKeys';
import { PackingTapeType } from '@/types/box-brand/materials/packingtape';
import { serializeQueryResult } from '@/utils/serializeQueryResult';

function listPackingTapes(): Promise<AxiosResponse<PackingTapeType[]>> {
  return axios.get('/box-brand/packingtape');
}

export function usePackingTapes(): UseQueryResult<PackingTapeType[], unknown> {
  const result = useQuery({
    queryKey: qk('packingtapes'),
    queryFn: () => listPackingTapes(),
  });
  return serializeQueryResult(result);
}
