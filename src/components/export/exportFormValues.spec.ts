import { describe, expect, it } from 'vitest';
import { exportBody } from './exportBody';
import { exportFormValues, exportFromLineValues } from './exportFormValues';
import { validationSchema } from './schemas/export.schema';
import { ExportResponse } from '../../types/export.response';
import { PurchaseOrderLine } from '../../types/purchaseOrder';

function exportResponse(
  overrides: Partial<ExportResponse> = {}
): ExportResponse {
  return {
    id: 40,
    boxQuantity: 1080,
    pendingExportSent: true,
    shipName: 'MSC Oslo',
    estimatedTravelTime: '18 días',
    bookingNumber: 'BK-7781',
    shippingDateTime: '2025-06-06T20:00:00.000Z',
    cuttingDate: '2025-06-04T05:00:00.000Z',
    weekDescription: 'Semana 23 // 02 junio al 08 junio 2025',
    weekDaysOfWeek: [
      'lunes/02',
      'martes/03',
      'miércoles/04',
      'jueves/05',
      'viernes/06',
      'sábado/07',
      'domingo/08',
    ],
    weekBoxesOfDay: [0, 0, 540, 540, 0, 0, 0],
    weekTotal: 1080,
    numberOfVerifiers: 2,
    contractType: 'FOB',
    cancelledAt: null,
    cancellationReason: null,
    booking: null,
    containers: [],
    merchant: { id: 3 },
    business: { id: 5 },
    boxBrand: { id: 11 },
    client: { id: 9 },
    harborDeparture: { id: 61 },
    harborDestination: { id: 62 },
    shippingCompany: { id: 31 },
    deposit: { id: 32 },
    transport: { id: 33 },
    verifier: { id: 34 },
    exportSent: null,
    ...overrides,
  } as unknown as ExportResponse;
}

describe('formulario prellenado desde una exportación', () => {
  it('toma los ids de cada participante y los datos del embarque', () => {
    const values = exportFormValues(exportResponse());

    expect(values).toMatchObject({
      boxQuantity: 1080,
      merchantId: 3,
      businessId: 5,
      boxBrandId: 11,
      clientId: 9,
      departureHarborId: 61,
      destinationHarborId: 62,
      shippingCompanyId: 31,
      depositId: 32,
      transportId: 33,
      verifierId: 34,
      shipName: 'MSC Oslo',
      bookingNumber: 'BK-7781',
      contractType: 'FOB',
      numberOfVerifiers: 2,
    });
    expect(values.cuttingDate).toEqual(new Date('2025-06-04T05:00:00.000Z'));
    expect(values.weekCutting.boxesOfDay).toEqual([0, 0, 540, 540, 0, 0, 0]);
  });

  it('deja en cero la logística que la exportación no tiene', () => {
    const values = exportFormValues(
      exportResponse({
        shippingCompany: null,
        deposit: null,
        transport: null,
        verifier: null,
      } as unknown as Partial<ExportResponse>)
    );

    expect(values).toMatchObject({
      shippingCompanyId: 0,
      depositId: 0,
      transportId: 0,
      verifierId: 0,
    });
  });

  it('completa con ceros una semana guardada con menos de siete días', () => {
    const values = exportFormValues(exportResponse({ weekBoxesOfDay: [1080] }));

    expect(values.weekCutting.boxesOfDay).toEqual([1080, 0, 0, 0, 0, 0, 0]);
  });

  it('guardar sin cambios manda los mismos datos que tiene la exportación', () => {
    const body = exportBody(exportFormValues(exportResponse()));

    expect(body).toEqual({
      boxQuantity: 1080,
      boxBrandId: 11,
      merchantId: 3,
      businessId: 5,
      clientId: 9,
      cuttingDate: new Date('2025-06-04T05:00:00.000Z'),
      shippingDateTime: new Date('2025-06-06T20:00:00.000Z'),
      shipName: 'MSC Oslo',
      estimatedTravelTime: '18 días',
      bookingNumber: 'BK-7781',
      contractType: 'FOB',
      numberOfVerifiers: 2,
      shippingCompanyId: 31,
      departureHarborId: 61,
      destinationHarborId: 62,
      depositId: 32,
      transportId: 33,
      verifierId: 34,
      bookingId: null,
      bookingContainerIds: [],
      weekDescription: 'Semana 23 // 02 junio al 08 junio 2025',
      weekDaysOfWeek: [
        'lunes/02',
        'martes/03',
        'miércoles/04',
        'jueves/05',
        'viernes/06',
        'sábado/07',
        'domingo/08',
      ],
      weekBoxesOfDay: [0, 0, 540, 540, 0, 0, 0],
      weekTotal: 1080,
    });
  });

  it('con booking toma sus contenedores al editar, pero no al duplicar', () => {
    const source = exportResponse({
      booking: { id: 90, bookingNumber: 'MAE260431' },
      containers: [{ id: 1, number: 'MSKU1234567' }],
    });

    expect(exportFormValues(source)).toMatchObject({
      bookingId: 90,
      bookingContainerIds: [1],
    });
    expect(exportFormValues(source, { withContainers: false })).toMatchObject({
      bookingId: 90,
      bookingContainerIds: [],
    });
    expect(exportBody(exportFormValues(source)).bookingId).toBe(90);
  });

  it('con booking el tiempo de viaje puede quedar vacío; sin booking es obligatorio', async () => {
    const values = {
      ...exportFormValues(exportResponse()),
      estimatedTravelTime: '',
      dataReviewed: true,
    };

    await expect(
      validationSchema.validateAt('estimatedTravelTime', values)
    ).rejects.toThrow();
    await expect(
      validationSchema.validateAt('estimatedTravelTime', {
        ...values,
        bookingId: 90,
      })
    ).resolves.toBe('');
  });
});

describe('exportación que nace de una línea de orden de compra', () => {
  const line: PurchaseOrderLine = {
    id: 300,
    type: 'CONTRACT',
    boxQuantity: 1080,
    price: null,
    business: { id: 5, name: 'Hacienda San Pedro' },
    boxBrand: { id: 11, name: 'Premium 22XU', brandCode: 'P22XU' },
    export: null,
  };

  it('arranca con el productor, la finca, la alícuota y las cajas de la línea, y la manda en el body', () => {
    const values = exportFromLineValues(3, line);

    expect(values).toMatchObject({
      merchantId: 3,
      businessId: 5,
      boxBrandId: 11,
      boxQuantity: 1080,
      purchaseOrderLineId: 300,
      bookingId: '',
    });
    expect(exportBody(values).purchaseOrderLineId).toBe(300);
  });

  it('editar o duplicar no manda la línea: una línea tiene una sola exportación', () => {
    const source = exportResponse({
      purchaseOrderLine: { id: 300, purchaseOrderId: 50 },
    });

    expect(exportBody(exportFormValues(source))).not.toHaveProperty(
      'purchaseOrderLineId'
    );
    expect(
      exportBody(exportFormValues(source, { withContainers: false }))
    ).not.toHaveProperty('purchaseOrderLineId');
  });
});
