import { PriceSheet, PriceSheetBody } from '../../types/priceSheet';
import { isMoney } from '../../utils/money';
import { isCompleteDay } from '../purchase-order/schemas/purchaseOrder.schema';

export type PriceValues = Record<string, string>;

// Formik reads a numeric segment as an array index, so line 300 would live
// in a sparse array: the key carries a letter.
export const priceKey = (lineId: number): string => `l${lineId}`;

export function pricesFromSheet(sheet: PriceSheet): PriceValues {
  return Object.fromEntries(
    sheet.lines.map((line) => [priceKey(line.lineId), line.price ?? ''])
  );
}

// An empty price sends the line back to the minimum. Nothing is sent while a
// typed price is not a valid amount.
export function priceSheetBody(
  weekDay: string,
  sheet: PriceSheet | undefined,
  prices: PriceValues
): PriceSheetBody | null {
  if (!sheet || !isCompleteDay(weekDay)) return null;
  const typed = sheet.lines.map((line) => ({
    lineId: line.lineId,
    text: (prices[priceKey(line.lineId)] ?? '').trim(),
  }));
  if (typed.some(({ text }) => text && !isMoney(text))) return null;
  return {
    week: weekDay,
    prices: typed.map(({ lineId, text }) => ({
      lineId,
      price: text ? Number(text) : null,
    })),
  };
}
