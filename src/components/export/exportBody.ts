import { ValuesProps } from './schemas/export.schema';

export type ExportBody = Omit<
  ValuesProps,
  'weekCutting' | 'bookingId' | 'purchaseOrderLineId'
> & {
  bookingId: number | null;
  purchaseOrderLineId?: number;
  weekDescription: string;
  weekDaysOfWeek: string[];
  weekBoxesOfDay: number[];
  weekTotal: number;
};

export function exportBody(values: ValuesProps): ExportBody {
  const { weekCutting, boxQuantity, bookingId, purchaseOrderLineId, ...rest } =
    values;
  return {
    ...rest,
    bookingId: bookingId ? Number(bookingId) : null,
    ...(purchaseOrderLineId
      ? { purchaseOrderLineId: Number(purchaseOrderLineId) }
      : {}),
    weekDescription: weekCutting.description,
    weekDaysOfWeek: weekCutting.daysOfWeek,
    weekBoxesOfDay: weekCutting.boxesOfDay,
    weekTotal: Number(boxQuantity),
    boxQuantity: Number(boxQuantity),
    numberOfVerifiers: Number(values.numberOfVerifiers),
  };
}
