import {
  keepPreviousData,
  useQuery,
  UseQueryResult,
} from '@tanstack/react-query';
import { AxiosResponse } from 'axios';
import axios from '@/lib/axios';
import { QueryConfig } from '@/lib/react-query';
import { BrandType } from '@/types/box-brand/specifications/brand';
import { serializeQueryResult } from '@/utils/serializeQueryResult';

export const getBrand = ({
  brandId,
}: {
  brandId: string;
}): Promise<AxiosResponse> => {
  return axios.get(`/box-brand/brand/${brandId}`);
};

type QueryFnType = typeof getBrand;

type UseBrandOptions = {
  brandId: string;
  config?: QueryConfig<QueryFnType>;
};

export const useBrand = ({
  brandId,
}: UseBrandOptions): UseQueryResult<BrandType> => {
  const result = useQuery({
    queryKey: ['brand', brandId],
    queryFn: () => getBrand({ brandId }),
    placeholderData: keepPreviousData,
  });

  return serializeQueryResult(result) as UseQueryResult<BrandType>;
};
