import { describe, expect, it } from 'vitest';
import { purchaseOrderBody } from './purchaseOrderBody';
import { validationSchema, ValuesProps } from './schemas/purchaseOrder.schema';

const MONDAY = '2026-10-19T05:00:00.000Z';
const values: ValuesProps = {
  type: 'CONTRACT',
  clientId: 9,
  startDay: MONDAY,
  endDay: '',
  notes: '  Programa de temporada ',
  lines: [
    { boxBrandId: 11, boxQuantity: '1000', price: '9.50' },
    { id: 7, boxBrandId: 12, boxQuantity: '700', price: '' },
  ],
};

describe('cuerpo de la orden de compra del cliente', () => {
  it('al crear manda el tipo, el cliente, la semana y las alícuotas; sin precio va nulo', () => {
    expect(purchaseOrderBody(values, { editing: false })).toEqual({
      type: 'CONTRACT',
      clientId: 9,
      startWeek: MONDAY,
      endWeek: null,
      notes: 'Programa de temporada',
      lines: [
        { boxBrandId: 11, boxQuantity: 1000, price: 9.5 },
        { id: 7, boxBrandId: 12, boxQuantity: 700, price: null },
      ],
    });
  });

  it('al editar no manda el tipo ni el cliente, que no cambian', () => {
    const body = purchaseOrderBody(values, { editing: true });

    expect(body).not.toHaveProperty('type');
    expect(body).not.toHaveProperty('clientId');
  });

  it('un contrato con fin la manda; un spot nunca lleva semana de fin', () => {
    const end = '2026-12-28T05:00:00.000Z';

    expect(
      purchaseOrderBody({ ...values, endDay: end }, { editing: false }).endWeek
    ).toBe(end);
    expect(
      purchaseOrderBody(
        { ...values, type: 'SPOT', endDay: end },
        { editing: false }
      ).endWeek
    ).toBeNull();
  });

  it('una alícuota va una sola vez en la orden', async () => {
    await expect(
      validationSchema.validateAt('lines', {
        ...values,
        lines: [
          { boxBrandId: 11, boxQuantity: '10', price: '' },
          { boxBrandId: 11, boxQuantity: '20', price: '' },
        ],
      })
    ).rejects.toThrow('Cada alícuota va una sola vez');
  });

  it('el precio es opcional, con hasta dos decimales', async () => {
    const line = (price: string): ValuesProps => ({
      ...values,
      lines: [{ boxBrandId: 11, boxQuantity: '10', price }],
    });

    await expect(
      validationSchema.validateAt('lines', line(''))
    ).resolves.toBeTruthy();
    await expect(
      validationSchema.validateAt('lines', line('9.555'))
    ).rejects.toThrow('Un número con hasta dos decimales');
  });
});
