import { useQuery } from '@tanstack/react-query';
import { PagedList, usePagedList } from '@/hooks/usePagedList';
import axios from '@/lib/axios';
import { CuttingSheetResponse } from '@/types/cuttingSheet.response';

export function useCuttingSheets(): PagedList<CuttingSheetResponse> {
  return usePagedList<CuttingSheetResponse>(
    'cuttingSheets',
    '/export/cutting-sheets'
  );
}

export function useCuttingSheet(id: number): {
  sheet: CuttingSheetResponse | undefined;
  isLoading: boolean;
  error: unknown;
} {
  const { data, isLoading, error } = useQuery({
    queryKey: ['cuttingSheets', 'detail', id],
    queryFn: async (): Promise<CuttingSheetResponse> =>
      (await axios.get(`/export/cutting-sheets/${id}`)).data,
    enabled: Number.isInteger(id) && id > 0,
    retry: false,
  });
  return { sheet: data, isLoading, error };
}
