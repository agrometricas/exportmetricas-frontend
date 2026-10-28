import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { AxiosResponse } from 'axios';
import axios from '@/lib/axios';
import { BrandType } from '@/types/box-brand/specifications/brand';
import { serializeQueryResult } from '@/utils/serializeQueryResult';

function listBrands(): Promise<AxiosResponse<BrandType[]>> {
  return axios.get('/box-brand/brand');
}

export function useBrands(): UseQueryResult<BrandType[], unknown> {
  const result = useQuery({
    queryKey: ['brands'],
    queryFn: () => listBrands(),
  });

  return serializeQueryResult(result);
}
