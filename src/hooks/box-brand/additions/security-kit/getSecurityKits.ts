import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { AxiosResponse } from 'axios';
import axios from '@/lib/axios';
import { qk } from '@/lib/queryKeys';
import { SecurityKitType } from '@/types/box-brand/additions/securityKit';
import { serializeQueryResult } from '@/utils/serializeQueryResult';

function listSecurityKits(): Promise<AxiosResponse<SecurityKitType[]>> {
  return axios.get('/box-brand/security-kit');
}

export function useSecurityKits(): UseQueryResult<SecurityKitType[], unknown> {
  const result = useQuery({
    queryKey: qk('securityKits'),
    queryFn: () => listSecurityKits(),
  });

  return serializeQueryResult(result);
}
