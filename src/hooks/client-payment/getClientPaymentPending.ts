import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { AxiosResponse } from 'axios';
import axios from '@/lib/axios';
import { ExportSentType } from '@/types/exportSent';
import { serializeQueryResult } from '@/utils/serializeQueryResult';

function listClientPaymentsPending(): Promise<
  AxiosResponse<Partial<ExportSentType>[]>
> {
  return axios.get('client-payment/pending');
}

export function useClientPaymentsPending(): UseQueryResult<
  Partial<ExportSentType>[],
  unknown
> {
  const result = useQuery({
    queryKey: ['clientPaymentsPending'],
    queryFn: () => listClientPaymentsPending(),
  });

  return serializeQueryResult(result);
}
