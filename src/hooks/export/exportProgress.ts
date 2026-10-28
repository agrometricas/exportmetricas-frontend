import { useQuery } from '@tanstack/react-query';
import { AxiosResponse } from 'axios';
import axios from '../../lib/axios';
import { ExportProgress, WorkQueue } from '../../types/exportProgress';
import { serializeQueryResult } from '../../utils/serializeQueryResult';

export const PROGRESS_QUERIES = ['exportProgress', 'workQueue'];

export function useExportProgress(
  exportId: string
): ReturnType<typeof serializeQueryResult> {
  return serializeQueryResult(
    useQuery({
      queryKey: ['exportProgress', exportId],
      queryFn: (): Promise<AxiosResponse<ExportProgress>> =>
        axios.get(`/export/${exportId}/progress`),
      enabled: Boolean(exportId),
    })
  );
}

export function useWorkQueue(): ReturnType<typeof serializeQueryResult> {
  return serializeQueryResult(
    useQuery({
      queryKey: ['workQueue'],
      queryFn: (): Promise<AxiosResponse<WorkQueue>> =>
        axios.get('/export/work-queue'),
    })
  );
}
