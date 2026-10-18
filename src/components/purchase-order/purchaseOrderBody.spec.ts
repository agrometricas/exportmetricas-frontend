import { describe, expect, it } from 'vitest';
import { purchaseOrderBody, purchaseOrderQuoteBody } from './purchaseOrderBody';
import {
  validationSchema,
  ValuesProps,
  valuesFromOrder,
} from './schemas/purchaseOrder.schema';
import { PurchaseOrderResponse } from '../../types/purchaseOrder';
import { INVALID_DAY_DATE } from '../ui/form/InputFieldDayDate';

const THURSDAY = new Date(2026, 9, 22).toISOString();

const values: ValuesProps = {
  merchantId: 3,
  weekDay: THURSDAY,
  notes: '  Entregar el miércoles  ',
  lines: [
    {
      id: 300,
      businessId: 5,
      boxBrandId: 11,
      boxQuantity: '1080',
      type: 'CONTRACT',
    },
    { businessId: 5, boxBrandId: 12, boxQuantity: '540', type: 'SPOT' },
  ],
};

describe('body de la orden de compra', () => {
  it('al crear manda el productor, el día elegido y las líneas como números', () => {
    expect(purchaseOrderBody(values, { editing: false })).toEqual({
      merchantId: 3,
      weekStart: THURSDAY,
      notes: 'Entregar el miércoles',
      lines: [
        {
          id: 300,
          businessId: 5,
          boxBrandId: 11,
          boxQuantity: 1080,
          type: 'CONTRACT',
        },
        { businessId: 5, boxBrandId: 12, boxQuantity: 540, type: 'SPOT' },
      ],
    });
  });

  it('al editar no manda el productor, y las notas vacías van como null', () => {
    const body = purchaseOrderBody(
      { ...values, notes: '   ' },
      { editing: true }
    );

    expect(body).not.toHaveProperty('merchantId');
    expect(body.notes).toBeNull();
  });
});

describe('cupo del borrador', () => {
  it('se pide con las líneas completas, sin id', () => {
    expect(
      purchaseOrderQuoteBody({
        ...values,
        lines: [
          ...values.lines,
          { businessId: 6, boxBrandId: '', boxQuantity: '20', type: 'SPOT' },
          { businessId: 6, boxBrandId: 11, boxQuantity: '2.5', type: 'SPOT' },
        ],
      })
    ).toEqual({
      merchantId: 3,
      weekStart: THURSDAY,
      lines: [
        { businessId: 5, boxBrandId: 11, boxQuantity: 1080, type: 'CONTRACT' },
        { businessId: 5, boxBrandId: 12, boxQuantity: 540, type: 'SPOT' },
      ],
    });
  });

  it('espera a tener productor y un día completo', () => {
    expect(purchaseOrderQuoteBody({ ...values, merchantId: '' })).toBeNull();
    expect(
      purchaseOrderQuoteBody({ ...values, weekDay: INVALID_DAY_DATE })
    ).toBeNull();
  });
});

describe('formulario de la orden', () => {
  it('al editar arranca con las líneas guardadas y el lunes de la semana', () => {
    const order = {
      id: 50,
      weekStart: new Date(2026, 9, 19).toISOString(),
      notes: null,
      merchant: { id: 3, businessName: 'Agrícola Paredes' },
      lines: [
        {
          id: 300,
          type: 'SPOT',
          boxQuantity: 540,
          business: { id: 5, name: 'Hacienda San Pedro' },
          boxBrand: { id: 12, name: 'Segunda', brandCode: 'S22' },
          export: null,
        },
      ],
      totals: { contractBoxes: 0, spotBoxes: 540, boxes: 540 },
      quota: [],
      warnings: [],
    } as PurchaseOrderResponse;

    expect(valuesFromOrder(order)).toEqual({
      merchantId: 3,
      weekDay: new Date(2026, 9, 19).toISOString(),
      notes: '',
      lines: [
        {
          id: 300,
          businessId: 5,
          boxBrandId: 12,
          boxQuantity: '540',
          type: 'SPOT',
        },
      ],
    });
  });

  it('rechaza cajas que no son un entero positivo', async () => {
    await expect(
      validationSchema.validateAt('lines[0].boxQuantity', {
        ...values,
        lines: [{ ...values.lines[0], boxQuantity: '0' }],
      })
    ).rejects.toThrow('Entre 1 y 100000 cajas');
  });
});
