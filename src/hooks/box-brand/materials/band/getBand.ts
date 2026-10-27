import {
  keepPreviousData,
  useQuery,
  UseQueryResult,
} from '@tanstack/react-query';
import { AxiosResponse } from 'axios';
import axios from '@/lib/axios';
import { QueryConfig } from '@/lib/react-query';
import { BandType } from '@/types/box-brand/materials/band';
import { serializeQueryResult } from '@/utils/serializeQueryResult';

export const getBand = ({
  bandId,
}: {
  bandId: string;
}): Promise<AxiosResponse> => {
  return axios.get(`/box-brand/band/${bandId}`);
};

type QueryFnType = typeof getBand;

type UseBandOptions = {
  bandId: string;
  config?: QueryConfig<QueryFnType>;
};

export const useBand = ({
  bandId,
}: UseBandOptions): UseQueryResult<BandType> => {
  const result = useQuery({
    queryKey: ['band', bandId],
    queryFn: () => getBand({ bandId }),
    placeholderData: keepPreviousData,
  });

  return serializeQueryResult(result) as UseQueryResult<BandType>;
};
