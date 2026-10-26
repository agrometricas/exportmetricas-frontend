import { UseMutationResult, useMutation } from 'react-query';
import { CostConfirmationBatchResult } from '@/types/costConfirmationBatch';
import axios from '../../../lib/axios';
import { PROGRESS_QUERIES } from '../exportProgress';

// A confirmed shipment leaves the review list and becomes payable to the
// producer and collectable from the client.
export const COST_CONFIRMATION_QUERIES = [
  'exportSentCostsPending',
  'confirmedExportSents',
  'exportsSentPending',
  'clientPaymentsPending',
  ...PROGRESS_QUERIES,
];

export const confirmExportSentCostReview = async (
  exportSentId: number
): Promise<void> => {
  await axios.patch(`/export-sent/${exportSentId}/confirm-producer-cost`);
};

export const confirmExportSentCosts = async (
  exportSentIds: number[]
): Promise<CostConfirmationBatchResult> => {
  const { data } = await axios.post<CostConfirmationBatchResult>(
    '/export-sent/confirm-producer-cost/batch',
    { exportSentIds }
  );
  return data;
};

export const useConfirmExportSentCosts = (): UseMutationResult<
  CostConfirmationBatchResult,
  unknown,
  number[]
> => useMutation(confirmExportSentCosts);
