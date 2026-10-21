import { describe, expect, it } from 'vitest';
import { boxQuantityLabel, cargoBody, cargoTypeLabel } from './cargoType';

describe('tipo de carga de la alícuota', () => {
  it('manda el tipo de caja como número', () => {
    expect(cargoBody({ cargoType: 'BULK', boxTypeId: '5' })).toEqual({
      cargoType: 'BULK',
      boxTypeId: 5,
    });
  });

  it('sin tipo de caja no lo manda', () => {
    expect(cargoBody({ cargoType: 'CONTAINER', boxTypeId: '' })).toEqual({
      cargoType: 'CONTAINER',
    });
  });

  it('sin tipo de carga elegido va en contenedor', () => {
    expect(cargoBody({ cargoType: '', boxTypeId: '' })).toEqual({
      cargoType: 'CONTAINER',
    });
  });

  it('con granel las cajas son una base de referencia', () => {
    expect(boxQuantityLabel('BULK')).toBe('Base de Referencia (cajas)');
    expect(boxQuantityLabel('CONTAINER')).toBe('Número de Cajas/Contenedor');
  });

  it('rotula el tipo de carga en español', () => {
    expect(cargoTypeLabel('BULK')).toBe('Granel');
    expect(cargoTypeLabel('CONTAINER')).toBe('Contenedor');
    expect(cargoTypeLabel(undefined)).toBe('—');
  });
});
