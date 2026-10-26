export interface CostConfirmationBatchResult {
  confirmed: number[];
  failed: { exportSentId: number; message: string }[];
}
