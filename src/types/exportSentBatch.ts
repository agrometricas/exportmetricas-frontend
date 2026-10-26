export interface ExportSentBatchResult {
  created: { exportId: number; exportSentId: number }[];
  failed: { exportId: number; message: string }[];
}
