import { belowDeckFor, boxBrandHasPallets } from './cuttingSheetOptions';
import {
  CuttingSheetBatchItem,
  CuttingSheetBatchResult,
  PendingSheet,
  SheetBatchRow,
} from '../types/cuttingSheetBatch';
import { CuttingType } from '../types/cuttingType';

export function cuttingTypesFor(
  boxBrandId: number | undefined,
  all: CuttingType[]
): CuttingType[] {
  const own = all.filter((type) => type.boxBrandId === boxBrandId);
  return own.length > 0 ? own : all;
}

export function initialSheetRow(
  sheet: PendingSheet,
  cuttingTypes: CuttingType[]
): SheetBatchRow {
  const options = cuttingTypesFor(sheet.export?.boxBrand?.id, cuttingTypes);
  return {
    exportSentId: sheet.id,
    cuttingTypeId: options.length === 1 ? String(options[0].id) : '',
    palletsHeight: boxBrandHasPallets(sheet.export?.boxBrand) ? '' : 'N/A',
    containerPositioning: '',
  };
}

export function isSheetRowReady(row: SheetBatchRow): boolean {
  return (
    !!row.cuttingTypeId && !!row.palletsHeight && !!row.containerPositioning
  );
}

export function sheetBatchBody(rows: SheetBatchRow[]): CuttingSheetBatchItem[] {
  return rows.map((row) => ({
    exportSentId: row.exportSentId,
    cuttingTypeId: Number(row.cuttingTypeId),
    palletsHeight: row.palletsHeight,
    containerPositioning: row.containerPositioning,
    belowDeck: belowDeckFor(row.containerPositioning),
  }));
}

export function sheetBatchSummary(result: CuttingSheetBatchResult): {
  status: 'success' | 'warning' | 'error';
  title: string;
} {
  const created = result.created.length;
  const failed = result.failed.length;
  const generated =
    created === 1 ? 'Se generó 1 hoja' : `Se generaron ${created} hojas`;

  if (failed === 0) return { status: 'success', title: generated };
  if (created === 0) {
    return { status: 'error', title: 'No se generó ninguna hoja' };
  }
  return {
    status: 'warning',
    title: `${generated}; ${failed === 1 ? '1 quedó pendiente' : `${failed} quedaron pendientes`}`,
  };
}
