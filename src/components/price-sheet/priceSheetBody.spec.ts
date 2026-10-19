import { describe, expect, it } from 'vitest';
import { priceKey, priceSheetBody, pricesFromSheet } from './priceSheetBody';
import { PriceSheet, PriceSheetLine } from '../../types/priceSheet';
import { isMoney } from '../../utils/money';
import { INVALID_DAY_DATE } from '../ui/form/InputFieldDayDate';

const THURSDAY = new Date(2026, 9, 22).toISOString();

const line = (lineId: number, price: string | null): PriceSheetLine =>
  ({ lineId, price }) as PriceSheetLine;

const sheet = { lines: [line(300, '8.25'), line(301, null)] } as PriceSheet;

describe('hoja semanal de precios en el formulario', () => {
  it('arranca con el precio guardado de cada línea, o vacío si usa el mínimo', () => {
    expect(pricesFromSheet(sheet)).toEqual({ l300: '8.25', l301: '' });
    expect(priceKey(300)).toBe('l300');
  });

  it('manda cada línea con su precio, y la vacía como null para que vuelva al mínimo', () => {
    expect(
      priceSheetBody(THURSDAY, sheet, { l300: ' 8.5 ', l301: '' })
    ).toEqual({
      week: THURSDAY,
      prices: [
        { lineId: 300, price: 8.5 },
        { lineId: 301, price: null },
      ],
    });
  });

  it('no manda nada mientras un precio no es un monto válido o el día está a medias', () => {
    expect(priceSheetBody(THURSDAY, sheet, { l300: '8.255' })).toBeNull();
    expect(priceSheetBody(THURSDAY, sheet, { l300: '0' })).toBeNull();
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
