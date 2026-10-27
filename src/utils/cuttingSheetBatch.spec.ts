import { describe, expect, it } from 'vitest';
import {
  cuttingTypesFor,
  initialSheetRow,
  isSheetRowReady,
  sheetBatchBody,
  sheetBatchSummary,
} from './cuttingSheetBatch';
import { PendingSheet } from '../types/cuttingSheetBatch';
import { CuttingType } from '../types/cuttingType';

const type = (id: number, boxBrandId: number): CuttingType =>
  ({
    id,
    boxBrandId,
    shipmentType: `Corte ${id}`,
  }) as CuttingType;

const ALL = [type(1, 10), type(2, 11), type(3, 11)];

const pending = (
  boxBrandId: number,
  palletsTypeQuantity: number
): PendingSheet => ({
  id: 90,
  export: {
    boxBrand: {
      id: boxBrandId,
      palletsType: { name: 'Pallet de madera' },
      palletsTypeQuantity,
    },
  },
});

describe('hojas de corte por lote', () => {
  it('ofrece los tipos de corte de la alícuota, o todos si no tiene', () => {
    expect(cuttingTypesFor(11, ALL).map(({ id }) => id)).toEqual([2, 3]);
    expect(cuttingTypesFor(99, ALL).map(({ id }) => id)).toEqual([1, 2, 3]);
  });

  it('llena el tipo de corte si la alícuota tiene uno solo, y la altura si no lleva pallets', () => {
    expect(initialSheetRow(pending(10, 20), ALL)).toEqual({
      exportSentId: 90,
      cuttingTypeId: '1',
      palletsHeight: '',
      containerPositioning: '',
    });
    expect(initialSheetRow(pending(11, 0), ALL)).toEqual({
      exportSentId: 90,
      cuttingTypeId: '',
      palletsHeight: 'N/A',
      containerPositioning: '',
    });
  });

  it('una hoja está lista con tipo de corte, altura y posición', () => {
    const row = {
      exportSentId: 90,
      cuttingTypeId: '1',
      palletsHeight: 'PALETS 9 DE ALTO',
      containerPositioning: '',
    };
    expect(isSheetRowReady(row)).toBe(false);
    expect(isSheetRowReady({ ...row, containerPositioning: 'CAMPO' })).toBe(
      true
    );
  });

  it('manda el tipo de corte como número y el bajo cubierta según la posición', () => {
    expect(
      sheetBatchBody([
        {
          exportSentId: 90,
          cuttingTypeId: '1',
          palletsHeight: 'N/A',
          containerPositioning: 'ACOPIO',
        },
      ])
    ).toEqual([
      {
        exportSentId: 90,
        cuttingTypeId: 1,
        palletsHeight: 'N/A',
        containerPositioning: 'ACOPIO',
        belowDeck: 'SI',
      },
    ]);
  });

  it('dice cuántas hojas se generaron y cuántas quedaron pendientes', () => {
    const ok = { exportSentId: 90, cuttingSheetId: 5, pdfUrl: 'u' };
    const ko = { exportSentId: 91, message: 'ya tiene hoja' };

    expect(sheetBatchSummary({ created: [ok, ok], failed: [] }).title).toBe(
      'Se generaron 2 hojas'
    );
    expect(sheetBatchSummary({ created: [ok], failed: [ko] })).toEqual({
      status: 'warning',
      title: 'Se generó 1 hoja; 1 quedó pendiente',
    });
    expect(sheetBatchSummary({ created: [], failed: [ko] }).status).toBe(
      'error'
    );
  });
});
