import { describe, expect, it } from 'vitest';
import { exportBody } from './exportBody';
import { exportFormValues } from './exportFormValues';
import { ExportResponse } from '../../types/export.response';

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

  it('pide volver a revisar los datos antes de guardar', () => {
    expect(exportFormValues(exportResponse()).dataReviewed).toBe(false);
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
});
