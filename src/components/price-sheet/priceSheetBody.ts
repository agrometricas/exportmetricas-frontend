import { PriceSheet, PriceSheetBody } from '../../types/priceSheet';
import { isMoney } from '../../utils/money';
import { isCompleteDay } from '../purchase-order/schemas/purchaseOrder.schema';

export type PriceValues = Record<string, string>;

// Formik reads a numeric segment as an array index, so export 300 would live
// in a sparse array: the key carries a letter.
export const priceKey = (exportId: number): string => `e${exportId}`;

const spotLines = (sheet: PriceSheet): PriceSheet['lines'] =>
  sheet.lines.filter((line) => line.editable);

export function pricesFromSheet(sheet: PriceSheet): PriceValues {
  return Object.fromEntries(
    spotLines(sheet).map((line) => [priceKey(line.exportId), line.price ?? ''])
  );
}

// Only spot exports are priced here: a contract one carries its contract's
// price. An empty price leaves the export without one, so the payment proposes
// the minimum. Nothing is sent while a typed price is not a valid amount.
export function priceSheetBody(
  weekDay: string,
  sheet: PriceSheet | undefined,
  prices: PriceValues
): PriceSheetBody | null {
  if (!sheet || !isCompleteDay(weekDay)) return null;
  const typed = spotLines(sheet).map((line) => ({
    exportId: line.exportId,
    text: (prices[priceKey(line.exportId)] ?? '').trim(),
  }));
  if (typed.some(({ text }) => text && !isMoney(text))) return null;
  return {
    week: weekDay,
    prices: typed.map(({ exportId, text }) => ({
      exportId,
      price: text ? Number(text) : null,
    })),
  };
}
