import { describe, expect, it } from 'vitest';
import {
  atHourMinute,
  formatDayMonthYear,
  formatDayMonthYearTime,
  isHourMinute,
  maskDayMonthYear,
  maskHourMinute,
  parseDayMonthYear,
  startOfLocalDay,
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

describe('fecha y hora', () => {
  it('se muestra como DD/MM/AAAA HH:mm, en hora local', () => {
    expect(formatDayMonthYearTime(new Date(2026, 2, 12, 15, 5))).toBe(
      '12/03/2026 15:05'
    );
    expect(formatDayMonthYearTime(null)).toBe('');
  });

  it('un día y una hora HH:mm forman ese momento en hora local', () => {
    const day = new Date(2026, 2, 12).toISOString();

    expect(atHourMinute(day, '15:30')).toBe(
      new Date(2026, 2, 12, 15, 30).toISOString()
    );
  });

  it('sin una hora válida no hay momento', () => {
    const day = new Date(2026, 2, 12).toISOString();

    expect(atHourMinute(day, '25:00')).toBeNull();
    expect(atHourMinute(day, '3:30')).toBeNull();
    expect(atHourMinute('', '15:30')).toBeNull();
    expect(isHourMinute('09:45')).toBe(true);
  });

  it('el día de un momento es su medianoche local', () => {
    const moment = new Date(2026, 2, 12, 15, 30).toISOString();

    expect(startOfLocalDay(moment)).toBe(new Date(2026, 2, 12).toISOString());
  });
});

describe('hora en HH:mm', () => {
  it('al escribir solo números pone los dos puntos', () => {
    expect(maskHourMinute('15')).toBe('15');
    expect(maskHourMinute('153')).toBe('15:3');
    expect(maskHourMinute('15:30')).toBe('15:30');
    expect(maskHourMinute('153099')).toBe('15:30');
  });
});
