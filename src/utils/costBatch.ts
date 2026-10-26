import { CostConfirmationBatchResult } from '../types/costConfirmationBatch';

const shipments = (count: number): string =>
  count === 1 ? '1 envío' : `${count} envíos`;

export function costBatchSummary(result: CostConfirmationBatchResult): {
  status: 'success' | 'warning' | 'error';
  title: string;
} {
  const done = result.confirmed.length;
  const failed = result.failed.length;
  const confirmed = `Se confirmaron los costos de ${shipments(done)}`;

  if (failed === 0) return { status: 'success', title: confirmed };
  if (done === 0) {
    return { status: 'error', title: 'No se confirmó ningún costo' };
  }
  return {
    status: 'warning',
    title: `${confirmed}; ${failed === 1 ? '1 quedó pendiente' : `${failed} quedaron pendientes`}`,
  };
}

export function formatUsd(amount: number): string {
  return `USD ${amount.toFixed(2)}`;
}
