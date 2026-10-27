//server
import {
  keepPreviousData,
  UseQueryResult,
  useQuery,
} from '@tanstack/react-query';
import { AxiosResponse } from 'axios';
import axios from '@/lib/axios';
import { QueryConfig } from '@/lib/react-query';
import { serializeQueryResult } from '@/utils/serializeQueryResult';
import { LatexRemoverType } from '../../../../types/box-brand/additions/latexRemover';

export const getLatexRemover = ({
  latexRemoverId,
}: {
  latexRemoverId: string;
}): Promise<AxiosResponse> => {
  return axios.get(`/box-brand/latex-remover/${latexRemoverId}`);
};

type QueryFnType = typeof getLatexRemover;

type UseLatexRemoverOptions = {
  latexRemoverId: string;
  config?: QueryConfig<QueryFnType>;
};

export const useLatexRemover = ({
  latexRemoverId,
}: UseLatexRemoverOptions): UseQueryResult<LatexRemoverType> => {
  const result = useQuery({
    queryKey: ['latexRemover', latexRemoverId],
    queryFn: () => getLatexRemover({ latexRemoverId }),
    placeholderData: keepPreviousData,
  });

  return serializeQueryResult(result) as UseQueryResult<LatexRemoverType>;
};
