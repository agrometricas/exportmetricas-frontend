import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { AxiosResponse } from 'axios';
import axios from '@/lib/axios';
import { qk } from '@/lib/queryKeys';
import { LatexRemoverType } from '@/types/box-brand/additions/latexRemover';
import { serializeQueryResult } from '@/utils/serializeQueryResult';

function listLatexRemovers(): Promise<AxiosResponse<LatexRemoverType[]>> {
  return axios.get('/box-brand/latex-remover');
}

export function useLatexRemovers(): UseQueryResult<
  LatexRemoverType[],
  unknown
> {
  const result = useQuery({
    queryKey: qk('latexRemovers'),
    queryFn: () => listLatexRemovers(),
  });

  return serializeQueryResult(result);
}
