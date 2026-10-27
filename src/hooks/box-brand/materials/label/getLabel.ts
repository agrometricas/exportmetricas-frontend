import {
  keepPreviousData,
  useQuery,
  UseQueryResult,
} from '@tanstack/react-query';
import { AxiosResponse } from 'axios';
import axios from '@/lib/axios';
import { QueryConfig } from '@/lib/react-query';
import { LabelType } from '@/types/box-brand/materials/label';
import { serializeQueryResult } from '@/utils/serializeQueryResult';

export const getLabel = ({
  labelId,
}: {
  labelId: string;
}): Promise<AxiosResponse> => {
  return axios.get(`/box-brand/label/${labelId}`);
};

type QueryFnType = typeof getLabel;

type UseLabelOptions = {
  labelId: string;
  config?: QueryConfig<QueryFnType>;
};

export const useLabel = ({
  labelId,
}: UseLabelOptions): UseQueryResult<LabelType> => {
  const result = useQuery({
    queryKey: ['label', labelId],
    queryFn: () => getLabel({ labelId }),
    placeholderData: keepPreviousData,
  });

  return serializeQueryResult(result) as UseQueryResult<LabelType>;
};
