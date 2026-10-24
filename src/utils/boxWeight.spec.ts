import { describe, expect, it } from 'vitest';
import { formatBoxWeight } from './boxWeight';

describe('peso de la caja en pantalla', () => {
  it('muestra las libras y los kilos que da el backend', () => {
    expect(formatBoxWeight(43, 19.5)).toBe('43 lb (19.50 kg)');
  });

  it('sin kilos muestra solo las libras', () => {
    expect(formatBoxWeight(43, undefined)).toBe('43 lb');
  });

  it('sin peso dice N/A', () => {
    expect(formatBoxWeight('', 0)).toBe('N/A');
    expect(formatBoxWeight(undefined, undefined)).toBe('N/A');
  });
});
