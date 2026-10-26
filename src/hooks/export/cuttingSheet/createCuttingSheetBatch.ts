import { UseMutationResult, useMutation } from 'react-query';
import axios from '@/lib/axios';
import {
  CuttingSheetBatchItem,
  CuttingSheetBatchResult,
} from '@/types/cuttingSheetBatch';

// Every sheet draws and uploads its own PDF, one after the other.
const BATCH_TIMEOUT_MS = 180_000;

export const createCuttingSheetBatch = async (
  sheets: CuttingSheetBatchItem[]
): Promise<CuttingSheetBatchResult> => {
  const { data } = await axios.post<CuttingSheetBatchResult>(
    '/export/cutting-sheet/batch',
    { sheets },
    { timeout: BATCH_TIMEOUT_MS }
  );
  return data;
};

export const useCreateCuttingSheetBatch = (): UseMutationResult<
  CuttingSheetBatchResult,
  unknown,
  CuttingSheetBatchItem[]
> => useMutation(createCuttingSheetBatch);
