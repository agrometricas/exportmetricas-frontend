import { describe, expect, it } from 'vitest';
import { documentStatusText, documentTrace } from './documentStatus';

describe('estado de un documento del embarque', () => {
  it('dice cuándo vence a partir de los días que da el backend', () => {
    expect(documentStatusText('VALID', 40)).toBe('Vence en 40 días');
    expect(documentStatusText('EXPIRING', 15)).toBe('Vence en 15 días');
    expect(documentStatusText('EXPIRING', 1)).toBe('Vence mañana');
    expect(documentStatusText('EXPIRING', 0)).toBe('Vence hoy');
  });

  it('un documento vencido dice hace cuánto', () => {
    expect(documentStatusText('EXPIRED', -1)).toBe('Venció ayer');
    expect(documentStatusText('EXPIRED', -9)).toBe('Venció hace 9 días');
  });

  it('sin vencimiento lo dice', () => {
    expect(documentStatusText('NO_EXPIRY', null)).toBe('Sin vencimiento');
  });
});

// Built in local time, like the other date specs, so the run's time zone
// does not change the expected text.
const UPLOADED = new Date(2026, 9, 24, 10, 30).toISOString();

describe('quién subió un documento', () => {
  it('dice quién, cuándo y el comienzo de la huella', () => {
    expect(
      documentTrace({
        createdAt: UPLOADED,
        uploadedBy: 'Usuario Demo',
        sha256:
          'ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad',
      })
    ).toBe('Usuario Demo, 24/10/2026 10:30 · huella ba7816bf8f01…');
  });

  it('un documento anterior no tiene huella ni quién lo subió', () => {
    expect(
      documentTrace({
        createdAt: UPLOADED,
        uploadedBy: null,
        sha256: null,
      })
    ).toBe('Sin registro de quién lo subió, 24/10/2026 10:30');
  });
});
