const DAY_MONTH_YEAR = /^(\d{2})\/(\d{2})\/(\d{4})$/;

// Local midnight, like every date field of the app: `new Date('2026-01-05')`
// would be UTC midnight and land on the previous day in Ecuador.
export function parseDayMonthYear(text: string): Date | null {
  const match = DAY_MONTH_YEAR.exec(text.trim());
  if (!match) return null;
  const [day, month, year] = match.slice(1).map(Number);
  const date = new Date(year, month - 1, day);
  const sameDay =
    date.getFullYear() === year &&
    date.getMonth() === month - 1 &&
    date.getDate() === day;
  return sameDay ? date : null;
}

export function formatDayMonthYear(value: string | Date | null | undefined): string {
  if (!value) return '';
  const date = typeof value === 'string' ? new Date(value) : value;
  if (Number.isNaN(date.getTime())) return '';
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  return `${day}/${month}/${date.getFullYear()}`;
}

export function maskDayMonthYear(input: string): string {
  const digits = input.replace(/\D/g, '').slice(0, 8);
  return [digits.slice(0, 2), digits.slice(2, 4), digits.slice(4)]
    .filter(Boolean)
    .join('/');
}
