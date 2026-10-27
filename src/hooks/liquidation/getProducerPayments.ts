import { PagedList, usePagedList } from '@/hooks/usePagedList';
import { ProducerPaymentListItem } from '@/types/producerPayment';

export function useProducerPayments(): PagedList<ProducerPaymentListItem> {
  return usePagedList<ProducerPaymentListItem>(
    'producerPayments',
    '/export/producer-payments'
  );
}
