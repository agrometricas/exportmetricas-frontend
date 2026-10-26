import { describe, expect, it } from 'vitest';
import { isSearchable, searchHitSummary } from './exportSearch';

describe('búsqueda rápida', () => {
  it('busca desde dos letras, o desde un número', () => {
    expect(isSearchable('j')).toBe(false);
    expect(isSearchable(' ju ')).toBe(true);
    expect(isSearchable('7')).toBe(true);
  });

  it('cada resultado dice qué exportación es, de quién y con qué booking', () => {
    expect(
      searchHitSummary({
        exportId: 29,
        cuttingDate: '2026-10-22T05:00:00.000Z',
        farm: 'Finca El Porvenir',
        producer: 'Bananera El Oro',
        client: 'Frutas del Norte GmbH',
        bookingNumber: 'MAE260431',
        containers: ['MSKU1234567', 'MSKU7654321'],
        cancelled: false,
      })
    ).toEqual({
      title: 'Exportación N.º 29',
      detail: 'Finca El Porvenir · Frutas del Norte GmbH · corte 22/10/2026',
      logistics: 'booking MAE260431 · MSKU1234567, MSKU7654321',
    });
  });

  it('sin fecha ni booking muestra solo lo que tiene', () => {
    expect(
      searchHitSummary({
        exportId: 30,
        cuttingDate: null,
        farm: 'Hacienda La Julia',
        producer: 'Agrícola Paredes',
        client: 'Nordic Fruit BV',
        bookingNumber: null,
        containers: [],
        cancelled: true,
      })
    ).toEqual({
      title: 'Exportación N.º 30',
      detail: 'Hacienda La Julia · Nordic Fruit BV',
      logistics: '',
    });
  });
});
