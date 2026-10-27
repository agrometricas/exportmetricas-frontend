import { useQuery } from 'react-query';
import axios from '@/lib/axios';
import { WeekSummary, WeekSummaryFilters } from '@/types/weekSummary';

export function useWeekSummary(
  week: string,
  filters: WeekSummaryFilters
): {
  summary: WeekSummary | undefined;
  isLoading: boolean;
  isPreviousData: boolean;
  isError: boolean;
  error: unknown;
  refetch: () => void;
} {
  const { data, isLoading, isPreviousData, isError, error, refetch } =
    useQuery<WeekSummary>(
      ['weekSummary', week, filters],
      async () =>
        (await axios.get('/reports/week', { params: { week, ...filters } }))
          .data,
      // Almost every write in the app changes some figure of the week, so the
      // home asks again each time it opens instead of waiting to be
      // invalidated.
      { keepPreviousData: true, staleTime: 0 }
    );
  return {
    summary: data,
    isLoading,
    isPreviousData,
    isError,
    error,
    refetch,
  };
}
