import { describe, expect, it } from 'vitest';
import {
  validationSchema,
  ValuesProps,
  valuesFromContract,
} from './schemas/shippingContract.schema';
import { shippingContractBody } from './shippingContractBody';
import { ShippingContractResponse } from '../../types/shippingContract';

const values: ValuesProps = {
  shippingCompanyId: 31,
  reference: '  MSK-2026 ',
  startDate: '2026-01-01T05:00:00.000Z',
  endDate: '2026-12-31T05:00:00.000Z',
  routes: [
    {
      harborDepartureId: 61,
      harborDestinationId: 62,
      costPerContainer: '3200,50',
      transitDays: '18',
    },
    {
      harborDepartureId: 61,
      harborDestinationId: 63,
      costPerContainer: '2950',
      transitDays: '',
    },
  ],
};

describe('body del contrato naviero', () => {
  it('manda los montos como número, aceptando la coma decimal', () => {
    expect(shippingContractBody(values, { withShippingCompany: true })).toEqual(
      {
        shippingCompanyId: 31,
        reference: 'MSK-2026',
        startDate: '2026-01-01T05:00:00.000Z',
        endDate: '2026-12-31T05:00:00.000Z',
        routes: [
          {
            harborDepartureId: 61,
            harborDestinationId: 62,
            costPerContainer: 3200.5,
            transitDays: 18,
          },
          {
            harborDepartureId: 61,
            harborDestinationId: 63,
            costPerContainer: 2950,
            transitDays: null,
          },
        ],
      }
    );
  });

  it('al editar no manda la naviera, y una referencia vacía va como null', () => {
    const body = shippingContractBody(
      { ...values, reference: '   ' },
      { withShippingCompany: false }
    );

    expect(body).not.toHaveProperty('shippingCompanyId');
    expect(body.reference).toBeNull();
  });

  it('el formulario de edición parte de lo que guardó el backend, con el costo a dos decimales', () => {
    const contract: ShippingContractResponse = {
      id: 80,
      reference: null,
      startDate: '2026-01-01T05:00:00.000Z',
      endDate: '2026-12-31T05:00:00.000Z',
      active: true,
      shippingCompany: { id: 31, name: 'Maersk', code: 'MSK' },
      routes: [
        {
          id: 1,
          costPerContainer: '3200.5',
          transitDays: null,
          harborDeparture: { id: 61, name: 'Guayaquil', code: 'GYE' },
          harborDestination: { id: 62, name: 'Róterdam', code: 'RTM' },
        },
      ],
    };

    expect(valuesFromContract(contract)).toEqual({
      shippingCompanyId: 31,
      reference: '',
      startDate: '2026-01-01T05:00:00.000Z',
      endDate: '2026-12-31T05:00:00.000Z',
      routes: [
        {
          harborDepartureId: 61,
          harborDestinationId: 62,
          costPerContainer: '3200.50',
          transitDays: '',
        },
      ],
    });
  });

  it.each([
    ['más de dos decimales', '3200.505'],
    ['cero', '0'],
    ['texto', 'tres mil'],
  ])('rechaza un costo por contenedor con %s', async (_, cost) => {
    const invalid = {
      ...values,
      routes: [{ ...values.routes[0], costPerContainer: cost }],
    };

    await expect(validationSchema.isValid(invalid)).resolves.toBe(false);
  });

  it('acepta el formulario completo', async () => {
    await expect(validationSchema.isValid(values)).resolves.toBe(true);
  });
});
