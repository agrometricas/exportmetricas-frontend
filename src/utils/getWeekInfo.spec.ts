import { describe, expect, it } from 'vitest';
import { getWeekInfo } from './getWeekInfo';

// Local dates, as the date picker builds them: `new Date('2025-06-04')` is UTC
// midnight and lands on the previous day in Ecuador.
const day = (year: number, month: number, date: number): Date =>
  new Date(year, month - 1, date);

describe('semana de un embarque', () => {
  it('un miércoles cae en la semana que va de su lunes a su domingo', () => {
    // 4 June 2025 is a Wednesday: Monday 2 to Sunday 8, ISO week 23.
    const { week, startDate } = getWeekInfo({ date: day(2025, 6, 4) });

    expect(week).toBe('Semana 23 // 02 junio al 08 junio 2025');
    expect(startDate).toEqual(day(2025, 6, 2));
  });

  it('el domingo pertenece a la semana que empezó el lunes anterior', () => {
    expect(getWeekInfo({ date: day(2025, 6, 8) }).week).toBe(
      'Semana 23 // 02 junio al 08 junio 2025'
    );
  });

  it('el lunes abre una semana nueva', () => {
    expect(getWeekInfo({ date: day(2025, 6, 9) }).week).toBe(
      'Semana 24 // 09 junio al 15 junio 2025'
    );
  });

  it('la semana 1 puede empezar en diciembre del año anterior', () => {
    // 30 December 2024 is a Monday; its week holds Thursday 2 January 2025.
    expect(getWeekInfo({ date: day(2024, 12, 30) }).week).toBe(
      'Semana 1 // 30 diciembre al 05 enero 2025'
    );
  });

  it('los primeros días de enero pueden ser la semana 53 del año anterior', () => {
    // 1 January 2021 is a Friday: its week started on Monday 28 December 2020.
    expect(getWeekInfo({ date: day(2021, 1, 1) }).week).toBe(
      'Semana 53 // 28 diciembre al 03 enero 2021'
    );
  });
});
