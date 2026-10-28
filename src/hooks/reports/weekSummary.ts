import { keepPreviousData, useQuery } from '@tanstack/react-query';
import axios from '@/lib/axios';
import { qk } from '@/lib/queryKeys';
import { WeekSummary, WeekSummaryFilters } from '@/types/weekSummary';

export function useWeekSummary(
  week: string,
  filters: WeekSummaryFilters
): {
  summary: WeekSummary | undefined;
  isLoading: boolean;
  isPlaceholderData: boolean;
  isError: boolean;
  error: unknown;
  refetch: () => void;
} {
  const { data, isLoading, isPlaceholderData, isError, error, refetch } =
    useQuery({
      queryKey: qk('weekSummary', week, filters),
      queryFn: async () =>
        (await axios.get('/reports/week', { params: { week, ...filters } }))
          .data,
      staleTime: 0,
      placeholderData: keepPreviousData,
    });
  return {
    summary: data,
    isLoading,
    isPlaceholderData,
    isError,
    error,
    refetch,
  };
}
