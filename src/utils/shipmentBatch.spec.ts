import { describe, expect, it } from 'vitest';
import { shipmentBatchSummary, toggleId } from './shipmentBatch';

describe('envío de insumos por lote', () => {
  it('marcar dos veces la misma exportación la saca de la selección', () => {
    expect(toggleId([3, 5], 7)).toEqual([3, 5, 7]);
    expect(toggleId([3, 5, 7], 5)).toEqual([3, 7]);
  });

  it('dice cuántos envíos se registraron y cuántos quedaron pendientes', () => {
    const ok = (exportId: number): { exportId: number; exportSentId: number } => ({
      exportId,
      exportSentId: exportId + 100,
    });
    const ko = (exportId: number): { exportId: number; message: string } => ({
      exportId,
      message: 'sin stock',
    });

    expect(shipmentBatchSummary({ created: [ok(1)], failed: [] })).toEqual({
      status: 'success',
      title: 'Se registró 1 envío',
    });
    expect(
      shipmentBatchSummary({ created: [ok(1), ok(2)], failed: [ko(3)] })
    ).toEqual({
      status: 'warning',
      title: 'Se registraron 2 envíos; 1 envío quedó pendiente',
    });
    expect(
      shipmentBatchSummary({ created: [], failed: [ko(1), ko(2)] })
    ).toEqual({ status: 'error', title: 'No se registró ningún envío' });
  });
});
