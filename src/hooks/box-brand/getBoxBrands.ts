import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { AxiosResponse } from 'axios';
import axios from '@/lib/axios';
import { BoxBrandType } from '@/types/box-brand/boxBrand';
import { serializeQueryResult } from '@/utils/serializeQueryResult';

function listBoxBrands(): Promise<AxiosResponse<BoxBrandType[]>> {
  return axios.get('/box-brand');
}

export function useBoxBrands(): UseQueryResult<BoxBrandType[], unknown> {
  const result = useQuery({
    queryKey: ['boxBrands'],
    queryFn: () => listBoxBrands(),
  });

  return serializeQueryResult(result);
}
