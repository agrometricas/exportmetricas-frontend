import { useQuery } from '@tanstack/react-query';
import { AxiosResponse } from 'axios';
import axios from '@/lib/axios';
import { serializeQueryResult } from '@/utils/serializeQueryResult';

function listSecurityKits(): Promise<AxiosResponse> {
  return axios.get('/box-brand/security-kit');
}

export function useSecurityKits(): ReturnType<typeof serializeQueryResult> {
  const result = useQuery({
    queryKey: ['securityKits'],
    queryFn: () => listSecurityKits(),
  });

  return serializeQueryResult(result);
}
