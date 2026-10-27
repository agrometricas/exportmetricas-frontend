import {
  keepPreviousData,
  useMutation,
  UseMutationResult,
  useQuery,
} from '@tanstack/react-query';
import { AxiosError, AxiosResponse } from 'axios';
import axios from '@/lib/axios';
import { ServerErrorResponse } from '@/types/errorResponse';
import { PriceSheet, PriceSheetBody } from '@/types/priceSheet';
import { useDebouncedValue } from '../useDebouncedValue';

const TYPING_PAUSE_MS = 300;

export function usePriceSheet(week: string | null): {
  sheet: PriceSheet | undefined;
  isLoading: boolean;
  error: unknown;
} {
  const { data, isLoading, error } = useQuery({
    queryKey: ['priceSheet', week],
    queryFn: async () =>
      (await axios.get('/price-sheet', { params: { week } })).data,
    enabled: week !== null,
  });
  return { sheet: data, isLoading, error };
}

// The totals on screen come from the backend: every edit asks for the sheet
// with the typed prices, without saving them.
export function usePriceSheetQuote(body: PriceSheetBody | null): {
  quote: PriceSheet | undefined;
  isSettled: boolean;
} {
  const current = body ? JSON.stringify(body) : null;
  const settled = useDebouncedValue(current, TYPING_PAUSE_MS);
  const { data, isFetching, isSuccess } = useQuery({
    queryKey: ['priceSheetQuote', settled],
    queryFn: async () =>
      (await axios.post('/price-sheet/quote', JSON.parse(settled as string)))
        .data,
    enabled: settled !== null,
    retry: false,
    placeholderData: keepPreviousData,
  });
  return {
    quote: data,
    isSettled:
      current !== null && current === settled && isSuccess && !isFetching,
  };
}

function savePriceSheet(
  body: PriceSheetBody
): Promise<AxiosResponse<PriceSheet>> {
  return axios.put('/price-sheet', body);
}

export function useSavePriceSheet(): UseMutationResult<
  AxiosResponse<PriceSheet>,
  AxiosError<ServerErrorResponse>,
  PriceSheetBody
> {
  return useMutation({ mutationFn: savePriceSheet });
}
