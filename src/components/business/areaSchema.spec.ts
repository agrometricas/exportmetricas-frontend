import { describe, expect, it } from 'vitest';
import { areaSchema, isHectares } from './areaSchema';

describe('área de la finca', () => {
  it('acepta hectáreas mayores que cero con hasta dos decimales', () => {
    expect([15.2, 15.25, 40, '42.5'].map(isHectares)).toEqual([
      true,
      true,
      true,
      true,
    ]);
  });

  it('rechaza tres decimales, cero, negativos y texto', async () => {
    expect([15.255, 0, -3, 'abc', undefined].map(isHectares)).toEqual([
      false,
      false,
      false,
      false,
      false,
    ]);
    await expect(areaSchema.validate(15.255)).rejects.toThrow(
      'Mayor que 0 y con hasta dos decimales'
    );
  });
});
