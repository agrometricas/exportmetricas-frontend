import { useQuery } from 'react-query';
import axios from '@/lib/axios';
import { useDebouncedValue } from '../useDebouncedValue';

const TYPING_PAUSE_MS = 300;

export interface PaymentQuoteResult<Quote> {
  quote: Quote | undefined;
  // True only when `quote` answers the inputs currently on screen. The form
  // must not submit before that: what gets stored is computed from the
  // inputs, and the user has to have seen that figure.
  isSettled: boolean;
}

export function usePaymentQuote<Params extends object, Quote>(
  path: string,
  params: Params | null
): PaymentQuoteResult<Quote> {
  const current = params ? JSON.stringify(params) : null;
  const settled = useDebouncedValue(current, TYPING_PAUSE_MS);

  const { data, isFetching, isSuccess } = useQuery<Quote>(
    [path, settled],
    async () => {
      const response = await axios.get(path, {
        params: JSON.parse(settled as string),
      });
      return response.data;
    },
    { enabled: settled !== null, keepPreviousData: true, retry: false }
  );

  return {
    quote: data,
    isSettled:
      current !== null && current === settled && isSuccess && !isFetching,
  };
}
