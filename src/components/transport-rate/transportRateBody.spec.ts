import { describe, expect, it } from 'vitest';
import {
  transportRateBody,
  validationSchema,
  ValuesProps,
} from './transportRateBody';

const values: ValuesProps = {
  transportId: 33,
  provinceId: 9,
  costPerContainer: '85,50',
};

describe('body de la tarifa de transporte', () => {
  it('al crear manda transportista, provincia y el costo como número', () => {
    expect(transportRateBody(values, { editing: false })).toEqual({
      transportId: 33,
      provinceId: 9,
      costPerContainer: 85.5,
    });
  });

  it('al editar solo manda el costo', () => {
    expect(transportRateBody(values, { editing: true })).toEqual({
      costPerContainer: 85.5,
    });
  });

  it.each([
    ['cero', '0'],
    ['tres decimales', '85.505'],
    ['texto', 'ochenta'],
  ])('rechaza un costo en %s', async (_, cost) => {
    await expect(
      validationSchema.isValid({ ...values, costPerContainer: cost })
    ).resolves.toBe(false);
  });
});
