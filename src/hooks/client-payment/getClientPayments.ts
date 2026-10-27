import { PagedList, usePagedList } from '@/hooks/usePagedList';
import { ClientPayment } from '@/types/client-payment/client-payment.response';

export function useClientPayments(): PagedList<ClientPayment> {
  return usePagedList<ClientPayment>('clientPayments', '/client-payment');
}
