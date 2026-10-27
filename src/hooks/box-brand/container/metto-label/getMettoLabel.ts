import {
  keepPreviousData,
  useQuery,
  UseQueryResult,
} from '@tanstack/react-query';
import { AxiosResponse } from 'axios';
import axios from '@/lib/axios';
import { QueryConfig } from '@/lib/react-query';
import { MettoLabelType } from '@/types/box-brand/container/mettoLabel';
import { serializeQueryResult } from '@/utils/serializeQueryResult';

export const getMettoLabel = ({
  mettoLabelId,
}: {
  mettoLabelId: string;
}): Promise<AxiosResponse> => {
  return axios.get(`/box-brand/metto-label/${mettoLabelId}`);
};

type QueryFnType = typeof getMettoLabel;

type UseMettoLabelOptions = {
  mettoLabelId: string;
  config?: QueryConfig<QueryFnType>;
};

export const useMettoLabel = ({
  mettoLabelId,
}: UseMettoLabelOptions): UseQueryResult<MettoLabelType> => {
  const result = useQuery({
    queryKey: ['mettoLabel', mettoLabelId],
    queryFn: () => getMettoLabel({ mettoLabelId }),
    placeholderData: keepPreviousData,
  });

  return serializeQueryResult(result) as UseQueryResult<MettoLabelType>;
};
