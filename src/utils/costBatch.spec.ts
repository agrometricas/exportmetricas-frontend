import { describe, expect, it } from 'vitest';
import { costBatchSummary, formatUsd } from './costBatch';

describe('confirmar costos por lote', () => {
  it('dice cuántos envíos quedaron confirmados y cuántos pendientes', () => {
    expect(costBatchSummary({ confirmed: [90], failed: [] })).toEqual({
      status: 'success',
      title: 'Se confirmaron los costos de 1 envío',
    });
    expect(
      costBatchSummary({
        confirmed: [90, 92],
        failed: [{ exportSentId: 91, message: 'cancelada' }],
      })
    ).toEqual({
      status: 'warning',
      title: 'Se confirmaron los costos de 2 envíos; 1 quedó pendiente',
    });
    expect(
      costBatchSummary({
        confirmed: [],
        failed: [{ exportSentId: 91, message: 'cancelada' }],
      }).status
    ).toBe('error');
  });

  it('el costo se muestra con dos decimales, como lo da el backend', () => {
    expect(formatUsd(1371.6)).toBe('USD 1371.60');
  });
});
