import { UseMutationResult, useMutation } from 'react-query';
import axios from '@/lib/axios';
import { ExportSentBatchResult } from '@/types/exportSentBatch';

// The backend registers one shipment after another; a long batch takes
// longer than the default timeout of the shared instance.
const BATCH_TIMEOUT_MS = 120_000;

export const createExportSentBatch = async (
  exportIds: number[]
): Promise<ExportSentBatchResult> => {
  const { data } = await axios.post<ExportSentBatchResult>(
    '/export/export-sent/batch',
    { exportIds },
    { timeout: BATCH_TIMEOUT_MS }
  );
  return data;
};

export const useCreateExportSentBatch = (): UseMutationResult<
  ExportSentBatchResult,
  unknown,
  number[]
> => useMutation(createExportSentBatch);
