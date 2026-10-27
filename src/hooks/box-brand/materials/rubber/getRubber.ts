import {
  keepPreviousData,
  useQuery,
  UseQueryResult,
} from '@tanstack/react-query';
import { AxiosResponse } from 'axios';
import axios from '@/lib/axios';
import { QueryConfig } from '@/lib/react-query';
import { RubberType } from '@/types/box-brand/materials/rubber';
import { serializeQueryResult } from '@/utils/serializeQueryResult';

export const getRubber = ({
  rubberId,
}: {
  rubberId: string;
}): Promise<AxiosResponse> => {
  return axios.get(`/box-brand/rubber/${rubberId}`);
};

type QueryFnType = typeof getRubber;

type UseRubberOptions = {
  rubberId: string;
  config?: QueryConfig<QueryFnType>;
};

export const useRubber = ({
  rubberId,
}: UseRubberOptions): UseQueryResult<RubberType> => {
  const result = useQuery({
    queryKey: ['rubber', rubberId],
    queryFn: () => getRubber({ rubberId }),
    placeholderData: keepPreviousData,
  });

  return serializeQueryResult(result) as UseQueryResult<RubberType>;
};
