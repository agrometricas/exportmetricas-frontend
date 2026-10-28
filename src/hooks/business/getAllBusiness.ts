import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { AxiosResponse } from 'axios';
import { qk } from '@/lib/queryKeys';
import axios from '../../lib/axios';
import { BusinessResponse } from '../../types/merchant/merchant.response';
import { serializeQueryResult } from '../../utils/serializeQueryResult';

function listBusinesses(): Promise<AxiosResponse<BusinessResponse[]>> {
  return axios.get('/merchant/business');
}

export function useBusinesses(): UseQueryResult<BusinessResponse[], unknown> {
  const result = useQuery({
    queryKey: qk('businesses'),
    queryFn: () => listBusinesses(),
  });

  return serializeQueryResult(result);
}
