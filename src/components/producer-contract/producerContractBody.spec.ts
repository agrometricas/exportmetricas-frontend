import { describe, expect, it } from 'vitest';
import { producerContractBody } from './producerContractBody';
import { initialValues } from './schemas/producerContract.schema';

const values = {
  ...initialValues,
  merchantId: 3,
  businessId: 50,
  approvedHectares: 12.5,
  approvedWeeklyBoxesPerHectare: 40,
  startDate: '2026-01-05T05:00:00.000Z',
};

describe('cuerpo del contrato de productor', () => {
  it('al crear manda la finca y no el productor', () => {
    const body = producerContractBody(values, { withBusiness: true });

    expect(body).toEqual({
      businessId: 50,
      approvedHectares: 12.5,
      approvedWeeklyBoxesPerHectare: 40,
      contractType: null,
      startDate: '2026-01-05T05:00:00.000Z',
      endDate: null,
    });
    expect(body).not.toHaveProperty('merchantId');
  });

  it('al editar no manda la finca, que no cambia', () => {
    expect(
      producerContractBody(values, { withBusiness: false })
    ).not.toHaveProperty('businessId');
  });

  it('sin fecha de fin el contrato queda abierto, y el tipo vacío se manda como nulo', () => {
    const body = producerContractBody(
      { ...values, contractType: '', endDate: '' },
      { withBusiness: true }
    );

    expect(body.endDate).toBeNull();
    expect(body.contractType).toBeNull();
  });

  it('no manda ninguna cifra calculada: las cajas por semana las calcula el backend', () => {
    expect(
      Object.keys(producerContractBody(values, { withBusiness: true }))
    ).not.toContain('approvedWeeklyBoxes');
  });
});
