import { describe, expect, it } from 'vitest';
import { exportPlanBody, planInitialValues, PlanValues } from './exportPlan';
import { PurchaseOrderLine } from '../../types/purchaseOrder';

const line = (
  id: number,
  boxQuantity: number,
  exported = false
): PurchaseOrderLine => ({
  id,
  type: 'CONTRACT',
  boxQuantity,
  price: null,
  business: { id: 21, name: 'Hacienda La Julia' },
  boxBrand: { id: 11, name: 'Premium 22XU', brandCode: 'P22XU' },
  export: exported ? { id: 900, boxQuantity, cuttingDate: null } : null,
});

const DAY = '2026-10-21T05:00:00.000Z';

function values(overrides: Partial<PlanValues> = {}): PlanValues {
  return {
    ...planInitialValues([line(300, 1080), line(301, 540)]),
    clientId: 9,
    departureHarborId: 61,
    destinationHarborId: 62,
    shipName: ' Maersk Oslo ',
    ...overrides,
  };
}

describe('plan semanal desde la orden de compra', () => {
  it('arranca con las líneas que aún no son exportación y sus cajas pedidas', () => {
    const initial = planInitialValues([
      line(300, 1080),
      line(301, 540, true),
      line(302, 300),
    ]);

    expect(
      initial.lines.map((l) => [
        l.purchaseOrderLineId,
        l.boxQuantity,
        l.include,
      ])
    ).toEqual([
      [300, 1080, true],
      [302, 300, true],
    ]);
  });

  it('manda solo las líneas incluidas, con su día y sus cajas como número', () => {
    const body = exportPlanBody(
      50,
      values({
        lines: [
          {
            purchaseOrderLineId: 300,
            include: true,
            cuttingDate: DAY,
            boxQuantity: 1000,
            bookingContainerIds: [],
          },
          {
            purchaseOrderLineId: 301,
            include: false,
            cuttingDate: '',
            boxQuantity: 540,
            bookingContainerIds: [],
          },
        ],
      })
    );

    expect(body).toEqual({
      purchaseOrderId: 50,
      clientId: 9,
      departureHarborId: 61,
      destinationHarborId: 62,
      shipName: 'Maersk Oslo',
      lines: [
        { purchaseOrderLineId: 300, cuttingDate: DAY, boxQuantity: 1000 },
      ],
    });
  });

  it('los contenedores van solo con booking', () => {
    const lines = [
      {
        purchaseOrderLineId: 300,
        include: true,
        cuttingDate: DAY,
        boxQuantity: 1080,
        bookingContainerIds: [5, 6],
      },
    ];

    expect(exportPlanBody(50, values({ lines })).lines[0]).not.toHaveProperty(
      'bookingContainerIds'
    );
    expect(
      exportPlanBody(50, values({ lines, bookingId: 70 })).lines[0]
        .bookingContainerIds
    ).toEqual([5, 6]);
  });
});
