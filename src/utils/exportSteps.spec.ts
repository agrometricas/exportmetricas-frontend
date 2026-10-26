import { describe, expect, it } from 'vitest';
import { returnTo, stepAction, withReturn } from './exportSteps';

const IDS = { exportId: 40, exportSentId: 70, bookingId: null };

describe('acción de cada paso de la exportación', () => {
  it('el envío y la hoja van con la exportación; costos, pago y cobro con el envío', () => {
    expect(stepAction({ key: 'supplies', status: 'TODO' }, IDS)).toEqual({
      label: 'Registrar envío',
      href: '/dashboard/liquidation/add-supply-shipment/40',
    });
    expect(stepAction({ key: 'cuttingSheet', status: 'TODO' }, IDS)).toEqual({
      label: 'Generar hoja',
      href: '/dashboard/export/add-cutting-sheet/40',
    });
    expect(stepAction({ key: 'clientPayment', status: 'TODO' }, IDS)).toEqual({
      label: 'Registrar cobro',
      href: '/dashboard/liquidation/client-pending-payments/70',
    });
  });

  it('lleva el regreso a la página de donde se salió', () => {
    expect(
      stepAction({ key: 'costs', status: 'TODO' }, IDS, '/dashboard/export/40')
    ).toEqual({
      label: 'Validar costos',
      href: '/dashboard/liquidation/add-export-cost/70?volver=%2Fdashboard%2Fexport%2F40',
    });
  });

  it('un paso hecho o en espera no tiene acción; la aduana abre su ventana', () => {
    expect(stepAction({ key: 'supplies', status: 'DONE' }, IDS)).toBeNull();
    expect(stepAction({ key: 'costs', status: 'WAITING' }, IDS)).toBeNull();
    expect(stepAction({ key: 'customs', status: 'TODO' }, IDS)).toEqual({
      label: 'Registrar AUCP y DAE',
      modal: 'customs',
    });
  });

  it('sin booking, se asigna solo si la exportación todavía se edita', () => {
    expect(stepAction({ key: 'booking', status: 'OPTIONAL' }, IDS)).toBeNull();
    expect(
      stepAction({ key: 'booking', status: 'OPTIONAL' }, IDS, undefined, true)
    ).toEqual({ label: 'Asignar booking', href: '/dashboard/export/40/edit' });
    expect(
      stepAction({ key: 'booking', status: 'TODO' }, { ...IDS, bookingId: 5 })
    ).toEqual({
      label: 'Ver documentos',
      href: '/dashboard/export/bookings/5',
    });
  });
});

describe('regreso después de guardar un paso', () => {
  it('vuelve a la página del enlace si es de la app', () => {
    expect(
      returnTo(
        '/dashboard/liquidation/client-payments',
        withReturn('', '/dashboard/export/40')
      )
    ).toBe('/dashboard/export/40');
  });

  it('sin regreso, o con una dirección de afuera, va a la lista de siempre', () => {
    const list = '/dashboard/liquidation/client-payments';
    expect(returnTo(list, '')).toBe(list);
    expect(returnTo(list, '?volver=https%3A%2F%2Fotro.sitio')).toBe(list);
    expect(returnTo(list, '?volver=%2F%2Fotro.sitio')).toBe(list);
  });
});
