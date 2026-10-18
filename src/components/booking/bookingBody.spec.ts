import { describe, expect, it } from 'vitest';
import { bookingBody } from './bookingBody';
import {
  validationSchema,
  ValuesProps,
  valuesFromBooking,
} from './schemas/booking.schema';
import { BookingResponse } from '../../types/booking';

const values: ValuesProps = {
  bookingNumber: ' MAE123456 ',
  shippingCompanyId: 31,
  harborDepartureId: 61,
  harborDestinationId: 62,
  shipName: ' Maersk Oslo ',
  etdDay: new Date(2026, 2, 12).toISOString(),
  etdTime: '15:30',
  containerCount: '3',
  containers: ['msku 123456-7', '', 'MSKU7654321'],
};

describe('body del booking', () => {
  it('une el día y la hora del zarpe y manda los contenedores con número, como los imprime la naviera', () => {
    expect(bookingBody(values)).toEqual({
      bookingNumber: 'MAE123456',
      shippingCompanyId: 31,
      harborDepartureId: 61,
      harborDestinationId: 62,
      shipName: 'Maersk Oslo',
      etd: new Date(2026, 2, 12, 15, 30).toISOString(),
      containerCount: 3,
      containers: ['MSKU1234567', 'MSKU7654321'],
    });
  });

  it('el formulario de edición separa el zarpe en día y hora locales', () => {
    const booking = {
      id: 90,
      bookingNumber: 'MAE123456',
      shipName: 'Maersk Oslo',
      etd: new Date(2026, 2, 12, 15, 30).toISOString(),
      eta: null,
      containerCount: 3,
      costPerContainer: '3200.5',
      transitDays: 18,
      estimatedFreight: '9601.50',
      shippingCompany: { id: 31, name: 'Maersk', code: 'MAEU' },
      shippingContract: { id: 80, reference: 'MAEU-2026' },
      harborDeparture: { id: 61, name: 'Guayaquil', code: 'ECGYE' },
      harborDestination: { id: 62, name: 'Róterdam', code: 'NLRTM' },
      containers: [{ id: 1, number: 'MSKU1234567', exportId: null }],
    } satisfies BookingResponse;

    expect(valuesFromBooking(booking)).toMatchObject({
      etdDay: new Date(2026, 2, 12).toISOString(),
      etdTime: '15:30',
      containerCount: '3',
      containers: ['MSKU1234567'],
    });
  });

  it('acepta el formulario completo', async () => {
    await expect(validationSchema.isValid(values)).resolves.toBe(true);
  });

  it.each([
    ['una hora fuera de rango', { etdTime: '24:10' }],
    ['un contenedor mal escrito', { containers: ['MSK123'] }],
    [
      'más números que contenedores reservados',
      { containerCount: '1', containers: ['MSKU1234567', 'MSKU7654321'] },
    ],
    ['cero contenedores reservados', { containerCount: '0' }],
  ])('rechaza %s', async (_, change) => {
    await expect(
      validationSchema.isValid({ ...values, ...change })
    ).resolves.toBe(false);
  });
});
