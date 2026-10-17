import { ValuesProps } from './schemas/export.schema';

export type ExportBody = Omit<ValuesProps, 'weekCutting' | 'dataReviewed'> & {
  weekDescription: string;
  weekDaysOfWeek: string[];
  weekBoxesOfDay: number[];
  weekTotal: number;
};

export function exportBody(values: ValuesProps): ExportBody {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { weekCutting, boxQuantity, dataReviewed, ...rest } = values;
  return {
    ...rest,
    weekDescription: weekCutting.description,
    weekDaysOfWeek: weekCutting.daysOfWeek,
    weekBoxesOfDay: weekCutting.boxesOfDay,
    weekTotal: Number(boxQuantity),
    boxQuantity: Number(boxQuantity),
    numberOfVerifiers: Number(values.numberOfVerifiers),
  };
}
