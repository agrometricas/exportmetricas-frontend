import { useQuery } from 'react-query';
import axios from '@/lib/axios';
import { CounterpartReport } from '@/types/counterpartTotals';

export function useCounterpartTotals(
  range: { from: string; to: string } | null
): { report: CounterpartReport | undefined; isLoading: boolean } {
  const { data, isLoading } = useQuery<CounterpartReport>(
    ['counterpartTotals', range?.from, range?.to],
    async () =>
      (await axios.get('/reports/counterparts', { params: range })).data,
    { enabled: range !== null, keepPreviousData: true, retry: false }
  );
  return { report: data, isLoading };
}
