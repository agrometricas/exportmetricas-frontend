import { describe, expect, it } from 'vitest';
import { missingSummary } from './shipmentStatus';
import { ChecklistItem } from '../types/shipmentStatus';

const item = (
  document: string,
  scope: string,
  detail: string
): ChecklistItem => ({ document, scope, status: 'PENDING', detail });

describe('lo que le falta a un booking', () => {
  it('muestra el motivo, con su exportación o contenedor cuando no es del booking', () => {
    expect(
      missingSummary([
        item('BL', 'Booking', 'Falta: BL.'),
        item('DAE', 'Exportación 40 · La Julia', 'Falta el valor de la DAE.'),
      ])
    ).toEqual([
      'Falta: BL.',
      'Exportación 40 · La Julia: Falta el valor de la DAE.',
    ]);
  });

  it('pasado el límite dice cuántos más faltan', () => {
    const four = ['BL', 'Fitosanitario', 'DAE', 'Factura'].map((document) =>
      item(document, 'Booking', `Falta: ${document}.`)
    );
    expect(missingSummary(four)).toEqual([
      'Falta: BL.',
      'Falta: Fitosanitario.',
      'y 2 más',
    ]);
  });

  it('sin nada pendiente no dice nada', () => {
    expect(missingSummary([])).toEqual([]);
  });
});
