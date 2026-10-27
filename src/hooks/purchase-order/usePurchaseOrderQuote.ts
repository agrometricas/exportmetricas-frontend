import { keepPreviousData, useQuery } from '@tanstack/react-query';
import axios from '@/lib/axios';
import { OrderQuota, PurchaseOrderQuoteBody } from '@/types/purchaseOrder';
import { useDebouncedValue } from '../useDebouncedValue';

const TYPING_PAUSE_MS = 300;

export function usePurchaseOrderQuote(body: PurchaseOrderQuoteBody | null): {
  quota: OrderQuota | undefined;
  isFetching: boolean;
} {
  const settled = useDebouncedValue(
    body ? JSON.stringify(body) : null,
    TYPING_PAUSE_MS
  );

  const { data, isFetching } = useQuery({
    queryKey: ['purchaseOrderQuote', settled],
    queryFn: async () => {
      const response = await axios.post(
        '/purchase-orders/quote',
        JSON.parse(settled as string)
      );
      return response.data;
    },
    enabled: settled !== null,
    retry: false,
    placeholderData: keepPreviousData,
  });

  return { quota: body ? data : undefined, isFetching };
}
