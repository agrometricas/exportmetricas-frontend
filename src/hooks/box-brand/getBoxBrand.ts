import {
  keepPreviousData,
  useQuery,
  UseQueryResult,
} from '@tanstack/react-query';
import { AxiosResponse } from 'axios';
import axios from '@/lib/axios';
import { QueryConfig } from '@/lib/react-query';
import { BoxBrandType } from '@/types/box-brand/boxBrand';
import { serializeQueryResult } from '@/utils/serializeQueryResult';

export const getBoxBrand = ({
  boxBrandId,
}: {
  boxBrandId: string;
}): Promise<AxiosResponse> => {
  return axios.get(`/box-brand/${boxBrandId}`);
};

type QueryFnType = typeof getBoxBrand;

type UseBoxBrandOptions = {
  boxBrandId: string;
  config?: QueryConfig<QueryFnType>;
};

export const useBoxBrand = ({
  boxBrandId,
}: UseBoxBrandOptions): UseQueryResult<BoxBrandType> => {
  const result = useQuery({
    queryKey: ['boxBrand', boxBrandId],
    queryFn: () => getBoxBrand({ boxBrandId }),
    placeholderData: keepPreviousData,
  });

  return serializeQueryResult(result) as UseQueryResult<BoxBrandType>;
};
