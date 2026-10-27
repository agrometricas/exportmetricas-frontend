import { PagedList, usePagedList } from '@/hooks/usePagedList';
import { ExportSentType } from '@/types/exportSent.response';

export function useExportsSent(): PagedList<ExportSentType> {
  return usePagedList<ExportSentType>('exportsSent', '/export/exports-sent');
}
