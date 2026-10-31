import { ValuesProps } from './schemas/export.schema';

export type ExportBody = Omit<ValuesProps, 'weekCutting' | 'bookingId'> & {
  bookingId: number | null;
  weekDescription: string;
  weekDaysOfWeek: string[];
  weekBoxesOfDay: number[];
  weekTotal: number;
};

export function exportBody(values: ValuesProps): ExportBody {
  const { weekCutting, boxQuantity, bookingId, ...rest } = values;
  return {
    ...rest,
    bookingId: bookingId ? Number(bookingId) : null,
    weekDescription: weekCutting.description,
    weekDaysOfWeek: weekCutting.daysOfWeek,
    weekBoxesOfDay: weekCutting.boxesOfDay,
    weekTotal: Number(boxQuantity),
    boxQuantity: Number(boxQuantity),
    numberOfVerifiers: Number(values.numberOfVerifiers),
  };
}
