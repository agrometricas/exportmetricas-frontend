import { describe, expect, it } from 'vitest';
import { QUANTITY_FIELDS, quantityUnit } from './materialUnits';

describe('unidad de una cantidad de la alícuota', () => {
  it('abrevia la unidad y dice si es por caja o por contenedor', () => {
    expect(quantityUnit('unidad', 'caja')).toBe('u/caja');
    expect(quantityUnit('ml', 'caja')).toBe('ml/caja');
    expect(quantityUnit('rollo', 'contenedor')).toBe('rollo/cont.');
    expect(quantityUnit('litro', 'contenedor')).toBe('L/cont.');
  });

  it('mientras la configuración no carga, cuenta unidades', () => {
    expect(quantityUnit(undefined, 'caja')).toBe('u/caja');
  });
});

describe('cantidades de la alícuota', () => {
  it('el fondo se cuenta por caja y el pallet por contenedor', () => {
    expect(QUANTITY_FIELDS.bottomTypeQuantity).toEqual({ type: 'BOTTOM', base: 'caja' });
    expect(QUANTITY_FIELDS.palletsTypeQuantity).toEqual({ type: 'PALLET', base: 'contenedor' });
  });

  it('cubre los 28 materiales con cantidad en la alícuota', () => {
    expect(Object.keys(QUANTITY_FIELDS)).toHaveLength(28);
  });
});
