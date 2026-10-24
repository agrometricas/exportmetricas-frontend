import { describe, expect, it } from 'vitest';
import { documentStatusText } from './documentStatus';

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
