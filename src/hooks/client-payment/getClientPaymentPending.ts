import { useQuery } from '@tanstack/react-query';
import { AxiosResponse } from 'axios';
import axios from '@/lib/axios';
import { serializeQueryResult } from '@/utils/serializeQueryResult';

function listClientPaymentsPending(): Promise<AxiosResponse> {
  return axios.get('client-payment/pending');
}

export function useClientPaymentsPending(): ReturnType<
  typeof serializeQueryResult
> {
  const result = useQuery({
    queryKey: ['clientPaymentsPending'],
    queryFn: () => listClientPaymentsPending(),
  });

  return serializeQueryResult(result);
}
