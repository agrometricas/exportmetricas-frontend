import { describe, expect, it } from 'vitest';
import {
  formatDayMonthYear,
  maskDayMonthYear,
  parseDayMonthYear,
} from './dayMonthYear';

describe('fecha en DD/MM/AAAA', () => {
  it('lee el día, el mes y el año en ese orden, a medianoche local', () => {
    const date = parseDayMonthYear('05/01/2026');

    expect(date).toEqual(new Date(2026, 0, 5));
  });

  it('rechaza un día que no existe y cualquier otro formato', () => {
    expect(parseDayMonthYear('31/02/2026')).toBeNull();
    expect(parseDayMonthYear('2026-01-05')).toBeNull();
    expect(parseDayMonthYear('5/1/2026')).toBeNull();
  });

  it('muestra la fecha con ceros a la izquierda', () => {
    expect(formatDayMonthYear(new Date(2026, 0, 5))).toBe('05/01/2026');
  });

  it('una fecha vacía o inválida se muestra vacía', () => {
    expect(formatDayMonthYear(null)).toBe('');
    expect(formatDayMonthYear('no es fecha')).toBe('');
  });

  it('al escribir solo números pone las barras', () => {
    expect(maskDayMonthYear('0501')).toBe('05/01');
    expect(maskDayMonthYear('05012026')).toBe('05/01/2026');
    expect(maskDayMonthYear('05/01/20269')).toBe('05/01/2026');
  });
});
