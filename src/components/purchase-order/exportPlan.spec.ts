import { describe, expect, it } from 'vitest';
import { exportPlanBody, planInitialValues, PlanValues } from './exportPlan';

const DAY = '2026-10-21T05:00:00.000Z';

function values(overrides: Partial<PlanValues> = {}): PlanValues {
  const initial = planInitialValues({ clientId: 9, boxBrandId: 11 });
  return {
    ...initial,
    lines: [
      {
        ...initial.lines[0],
        businessId: 21,
        cuttingDate: DAY,
        boxQuantity: 1080,
      },
      {
        ...initial.lines[0],
        businessId: 22,
        cuttingDate: DAY,
        boxQuantity: 540,
      },
    ],
    departureHarborId: 61,
    destinationHarborId: 62,
    shipName: ' Maersk Oslo ',
    ...overrides,
  };
}

describe('asignar fincas a lo que pidió el cliente', () => {
  it('arranca con una finca por llenar, la alícuota del pedido y lo que falta asignar', () => {
    const initial = planInitialValues({
      clientId: 9,
      boxBrandId: 11,
      pendingBoxes: 1200,
    });

    expect(initial.clientId).toBe(9);
    expect(initial.lines).toEqual([
      {
        businessId: '',
        boxBrandId: 11,
        cuttingDate: '',
        boxQuantity: 1200,
        bookingContainerIds: [],
      },
    ]);
  });

  it('sin nada pendiente las cajas arrancan vacías', () => {
    expect(
      planInitialValues({ clientId: 9, boxBrandId: 11, pendingBoxes: 0 })
        .lines[0].boxQuantity
    ).toBe('');
  });

  it('manda cada finca con su alícuota, su día y sus cajas; el cliente y lo común una vez', () => {
    const body = exportPlanBody(values());

    expect(body).toEqual({
      clientId: 9,
      departureHarborId: 61,
      destinationHarborId: 62,
      shippingDateTime: undefined,
      shipName: 'Maersk Oslo',
      estimatedTravelTime: undefined,
      bookingNumber: undefined,
      numberOfVerifiers: undefined,
      shippingCompanyId: undefined,
      depositId: undefined,
      transportId: undefined,
      verifierId: undefined,
      bookingId: undefined,
      lines: [
        { businessId: 21, boxBrandId: 11, cuttingDate: DAY, boxQuantity: 1080 },
        { businessId: 22, boxBrandId: 11, cuttingDate: DAY, boxQuantity: 540 },
      ],
    });
  });

  it('no manda el tipo de contrato ni el precio: los decide el contrato de cada finca', () => {
    const [line] = exportPlanBody(values()).lines;

    expect(line).not.toHaveProperty('contractType');
    expect(line).not.toHaveProperty('price');
  });

  it('los contenedores solo van con booking', () => {
    const withContainers = values();
    withContainers.lines[0].bookingContainerIds = [5];

    expect(exportPlanBody(withContainers).lines[0]).not.toHaveProperty(
      'bookingContainerIds'
    );
    expect(
      exportPlanBody({ ...withContainers, bookingId: 70 }).lines[0]
        .bookingContainerIds
    ).toEqual([5]);
  });
});
