import {
  keepPreviousData,
  useQuery,
  UseQueryResult,
} from '@tanstack/react-query';
import { AxiosResponse } from 'axios';
import axios from '@/lib/axios';
import { QueryConfig } from '@/lib/react-query';
import { BlockingSheetType } from '@/types/box-brand/additions/blockingSheet';
import { serializeQueryResult } from '@/utils/serializeQueryResult';

export const getBlockingSheet = ({
  blockingSheetId,
}: {
  blockingSheetId: string;
}): Promise<AxiosResponse> => {
  return axios.get(`/box-brand/blocking-sheet/${blockingSheetId}`);
};

type QueryFnType = typeof getBlockingSheet;

type UseBlockingSheetOptions = {
  blockingSheetId: string;
  config?: QueryConfig<QueryFnType>;
};

export const useBlockingSheet = ({
  blockingSheetId,
}: UseBlockingSheetOptions): UseQueryResult<BlockingSheetType> => {
  const result = useQuery({
    queryKey: ['blockingSheet', blockingSheetId],
    queryFn: () => getBlockingSheet({ blockingSheetId }),
    placeholderData: keepPreviousData,
  });

  return serializeQueryResult(result) as UseQueryResult<BlockingSheetType>;
};
