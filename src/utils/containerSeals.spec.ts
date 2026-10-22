import { describe, expect, it } from 'vitest';
import { containerLabel, sealsBody, sealsValues } from './containerSeals';

describe('sellos del contenedor', () => {
  it('los sellos extra se escriben separados por comas', () => {
    expect(
      sealsBody({ shippingLineSeal: ' ML123 ', extraSeals: 'V1, V2 ,, ' })
    ).toEqual({ shippingLineSeal: 'ML123', extraSeals: ['V1', 'V2'] });
  });

  it('un formulario vacío borra los sellos', () => {
    expect(sealsBody({ shippingLineSeal: ' ', extraSeals: '' })).toEqual({
      shippingLineSeal: null,
      extraSeals: [],
    });
  });

  it('el formulario arranca con los sellos guardados', () => {
    expect(
      sealsValues({ shippingLineSeal: 'ML123', extraSeals: ['V1', 'V2'] })
    ).toEqual({ shippingLineSeal: 'ML123', extraSeals: 'V1, V2' });
    expect(sealsValues({})).toEqual({ shippingLineSeal: '', extraSeals: '' });
  });

  it('muestra el contenedor con sus sellos', () => {
    expect(
      containerLabel({
        number: 'MSKU1234567',
        shippingLineSeal: 'ML123',
        extraSeals: ['V1'],
      })
    ).toBe('MSKU1234567 (sello ML123; extra V1)');
    expect(containerLabel({ number: 'MSKU1234567' })).toBe('MSKU1234567');
  });
});
