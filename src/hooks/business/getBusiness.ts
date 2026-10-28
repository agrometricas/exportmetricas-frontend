import {
  keepPreviousData,
  UseQueryResult,
  useQuery,
} from '@tanstack/react-query';
import { AxiosResponse } from 'axios';
import axios from '@/lib/axios';
import { qk } from '@/lib/queryKeys';
import { QueryConfig } from '@/lib/react-query';
import { serializeQueryResult } from '@/utils/serializeQueryResult';
import { BusinessType } from '../../types/merchant/business';

export const getBusiness = ({
  businessId,
}: {
  businessId: string;
}): Promise<AxiosResponse> => {
  return axios.get(`/merchant/business/${businessId}`);
};

type QueryFnType = typeof getBusiness;

type UseBusinessOptions = {
  businessId: string;
  config?: QueryConfig<QueryFnType>;
};

export const useBusiness = ({
  businessId,
}: UseBusinessOptions): UseQueryResult<BusinessType> => {
  const result = useQuery({
    queryKey: qk('business', businessId),
    queryFn: () => getBusiness({ businessId }),
    placeholderData: keepPreviousData,
  });

  return serializeQueryResult(result) as UseQueryResult<BusinessType>;
};
