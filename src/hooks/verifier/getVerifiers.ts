import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { AxiosResponse } from 'axios';
import axios from '@/lib/axios';
import { qk } from '@/lib/queryKeys';
import { serializeQueryResult } from '@/utils/serializeQueryResult';
import { VerifierResponse } from '../../types/verifier/verifier.response';

function listVerifiers(): Promise<AxiosResponse<VerifierResponse[]>> {
  return axios.get('/verifier');
}

export function useVerifiers(): UseQueryResult<VerifierResponse[], unknown> {
  const result = useQuery({
    queryKey: qk('verifiers'),
    queryFn: () => listVerifiers(),
  });

  return serializeQueryResult(result);
}
