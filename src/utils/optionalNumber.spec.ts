import { describe, expect, it } from 'vitest';
import { optionalNumber } from './optionalNumber';

describe('número opcional de un formulario', () => {
  it('un campo vacío no se envía', () => {
    expect(optionalNumber('')).toBeUndefined();
    expect(optionalNumber(null)).toBeUndefined();
    expect(optionalNumber(undefined)).toBeUndefined();
  });

  it('un número se envía tal cual, también el cero', () => {
    expect(optionalNumber(12.5)).toBe(12.5);
    expect(optionalNumber(0)).toBe(0);
  });

  it('el cuerpo armado con él omite la clave del campo vacío', () => {
    const body = JSON.stringify({ area: 40, approvedHectares: optionalNumber('') });

    expect(body).toBe('{"area":40}');
  });
});
