import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { AxiosResponse } from 'axios';
import axios from '../../lib/axios';
import { ExportProgress, WorkQueue } from '../../types/exportProgress';
import { serializeQueryResult } from '../../utils/serializeQueryResult';

export const PROGRESS_QUERIES = ['exportProgress', 'workQueue'];

export function useExportProgress(
  exportId: string
): UseQueryResult<ExportProgress, unknown> {
  return serializeQueryResult(
    useQuery({
      queryKey: ['exportProgress', exportId],
      queryFn: (): Promise<AxiosResponse<ExportProgress>> =>
        axios.get(`/export/${exportId}/progress`),
      enabled: Boolean(exportId),
    })
  );
}

export function useWorkQueue(): UseQueryResult<WorkQueue, unknown> {
  return serializeQueryResult(
    useQuery({
      queryKey: ['workQueue'],
      queryFn: (): Promise<AxiosResponse<WorkQueue>> =>
        axios.get('/export/work-queue'),
    })
  );
}
