import { PagedList, usePagedList } from '@/hooks/usePagedList';
import { ExportResponse } from '@/types/export.response';

export function useExports(): PagedList<ExportResponse> {
  return usePagedList<ExportResponse>('exports', '/export');
}
