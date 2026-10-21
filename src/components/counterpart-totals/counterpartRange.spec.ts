import { describe, expect, it } from 'vitest';
import { counterpartRange, startOfMonth } from './counterpartRange';
import { INVALID_DAY_DATE } from '../ui/form/InputFieldDayDate';

const OCT_1 = new Date(2026, 9, 1).toISOString();
const OCT_31 = new Date(2026, 9, 31).toISOString();

describe('período de los totales por contraparte', () => {
  it('arranca el primer día del mes, a medianoche local', () => {
    expect(startOfMonth(new Date(2026, 9, 21, 15, 30))).toBe(OCT_1);
  });

  it('pide el reporte con las dos fechas completas y en orden', () => {
    expect(counterpartRange(OCT_1, OCT_31)).toEqual({
      from: OCT_1,
      to: OCT_31,
    });
    expect(counterpartRange(OCT_31, OCT_1)).toBeNull();
    expect(counterpartRange(OCT_1, INVALID_DAY_DATE)).toBeNull();
    expect(counterpartRange('', OCT_31)).toBeNull();
  });
});
