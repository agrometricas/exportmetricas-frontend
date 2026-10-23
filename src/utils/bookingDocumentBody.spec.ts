import { describe, expect, it } from 'vitest';
import { bookingDocumentBody, EMPTY_DOCUMENT } from './bookingDocumentBody';

describe('formulario de un documento del embarque', () => {
  it('manda el tipo, el número sin espacios, las fechas, el contenedor y el archivo', () => {
    const file = new File(['%PDF'], 'Inspección.pdf', {
      type: 'application/pdf',
    });

    const body = bookingDocumentBody({
      type: 'CONTAINER_INSPECTION',
      number: ' INS-9 ',
      containerId: '11',
      issuedAt: '2026-10-01T05:00:00.000Z',
      expiresAt: '2026-10-31T05:00:00.000Z',
      file,
    });

    expect(body.get('type')).toBe('CONTAINER_INSPECTION');
    expect(body.get('number')).toBe('INS-9');
    expect(body.get('containerId')).toBe('11');
    expect(body.get('issuedAt')).toBe('2026-10-01T05:00:00.000Z');
    expect(body.get('expiresAt')).toBe('2026-10-31T05:00:00.000Z');
    expect((body.get('file') as File).name).toBe('Inspección.pdf');
  });

  it('lo que queda vacío no se manda', () => {
    const body = bookingDocumentBody({
      ...EMPTY_DOCUMENT,
      type: 'BILL_OF_LADING',
      number: 'MAEU123',
    });

    const keys: string[] = [];
    body.forEach((_value, key) => keys.push(key));
    expect(keys).toEqual(['type', 'number']);
  });
});
