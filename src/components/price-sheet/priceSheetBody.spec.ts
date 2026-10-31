import { describe, expect, it } from 'vitest';
import { priceKey, priceSheetBody, pricesFromSheet } from './priceSheetBody';
import { PriceSheet, PriceSheetLine } from '../../types/priceSheet';
import { isMoney } from '../../utils/money';
import { INVALID_DAY_DATE } from '../ui/form/InputFieldDayDate';

const THURSDAY = new Date(2026, 9, 22).toISOString();

const line = (
  exportId: number,
  price: string | null,
  editable = true
): PriceSheetLine =>
  ({
    exportId,
    price,
    editable,
  }) as PriceSheetLine;

const sheet = {
  lines: [line(300, '6.25'), line(301, null), line(302, '7.60', false)],
} as PriceSheet;

describe('hoja semanal de precios en el formulario', () => {
  it('arranca con el precio de cada spot, o vacío si no tiene; las de contrato no se editan', () => {
    expect(pricesFromSheet(sheet)).toEqual({ e300: '6.25', e301: '' });
    expect(priceKey(300)).toBe('e300');
  });

  it('manda cada spot con su precio, y la vacía como null; nunca una de contrato', () => {
    expect(
      priceSheetBody(THURSDAY, sheet, { e300: ' 6.5 ', e301: '', e302: '9' })
    ).toEqual({
      week: THURSDAY,
      prices: [
        { exportId: 300, price: 6.5 },
        { exportId: 301, price: null },
      ],
    });
  });

  it('no manda nada mientras un precio no es un monto válido o el día está a medias', () => {
    expect(priceSheetBody(THURSDAY, sheet, { e300: '8.255' })).toBeNull();
    expect(priceSheetBody(THURSDAY, sheet, { e300: '0' })).toBeNull();
    expect(priceSheetBody(INVALID_DAY_DATE, sheet, {})).toBeNull();
    expect(priceSheetBody(THURSDAY, undefined, {})).toBeNull();
  });
});

describe('monto', () => {
  it('es un número mayor que cero con hasta dos decimales', () => {
    expect(['7.5', '7.50', '10', ' 9.75 '].map(isMoney)).toEqual([
      true,
      true,
      true,
      true,
    ]);
    expect(
      ['', '0', '0.00', '7.505', '-1', '7,50', 'abc'].map(isMoney)
    ).toEqual([false, false, false, false, false, false, false]);
  });
});
