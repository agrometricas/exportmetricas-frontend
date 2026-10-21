import { INVALID_DAY_DATE } from '../ui/form/InputFieldDayDate';

// The report covers whole days: both ends travel as local midnight and the
// backend includes the last one.
export function counterpartRange(
  from: string,
  to: string
): { from: string; to: string } | null {
  if (!from || !to || from === INVALID_DAY_DATE || to === INVALID_DAY_DATE) {
    return null;
  }
  if (new Date(to).getTime() < new Date(from).getTime()) return null;
  return { from, to };
}

export function startOfMonth(today: Date): string {
  return new Date(today.getFullYear(), today.getMonth(), 1).toISOString();
}
