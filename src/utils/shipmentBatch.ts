import { ExportSentBatchResult } from '../types/exportSentBatch';

const shipments = (count: number): string =>
  count === 1 ? '1 envío' : `${count} envíos`;

export function shipmentBatchSummary(result: ExportSentBatchResult): {
  status: 'success' | 'warning' | 'error';
  title: string;
} {
  const created = result.created.length;
  const failed = result.failed.length;
  const registered =
    created === 1 ? 'Se registró 1 envío' : `Se registraron ${created} envíos`;

  if (failed === 0) return { status: 'success', title: registered };
  if (created === 0) {
    return { status: 'error', title: 'No se registró ningún envío' };
  }
  return {
    status: 'warning',
    title: `${registered}; ${shipments(failed)} ${failed === 1 ? 'quedó pendiente' : 'quedaron pendientes'}`,
  };
}
