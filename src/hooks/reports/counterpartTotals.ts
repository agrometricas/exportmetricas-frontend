import { keepPreviousData, useQuery } from '@tanstack/react-query';
import axios from '@/lib/axios';
import { CounterpartReport } from '@/types/counterpartTotals';

export function useCounterpartTotals(
  range: { from: string; to: string } | null
): { report: CounterpartReport | undefined; isLoading: boolean } {
  const { data, isLoading } = useQuery({
    queryKey: ['counterpartTotals', range?.from, range?.to],
    queryFn: async () =>
      (await axios.get('/reports/counterparts', { params: range })).data,
    enabled: range !== null,
    retry: false,
    placeholderData: keepPreviousData,
  });
  return { report: data, isLoading };
}
