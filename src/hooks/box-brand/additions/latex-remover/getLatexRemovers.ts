/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { useQuery } from '@tanstack/react-query';
import { AxiosResponse } from 'axios';
import axios from '@/lib/axios';
import { serializeQueryResult } from '@/utils/serializeQueryResult';

function listLatexRemovers(): Promise<AxiosResponse> {
  return axios.get('/box-brand/latex-remover');
}

export function useLatexRemovers() {
  const result = useQuery({
    queryKey: ['latexRemovers'],
    queryFn: () => listLatexRemovers(),
  });

  return serializeQueryResult(result);
}
