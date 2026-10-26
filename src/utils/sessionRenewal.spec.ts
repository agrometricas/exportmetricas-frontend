import { describe, expect, it } from 'vitest';
import { needsRenewal, tokenLifetime } from './sessionRenewal';

function jwtWith(payload: object): string {
  const encode = (value: object): string =>
    btoa(JSON.stringify(value))
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/, '');
  return `${encode({ alg: 'HS256' })}.${encode(payload)}.firma`;
}

const ISSUED = 1_800_000_000;
const token = jwtWith({ sub: 3, iat: ISSUED, exp: ISSUED + 3600 });

describe('renovación de la sesión', () => {
  it('lee cuándo se emitió y cuándo vence el token', () => {
    expect(tokenLifetime(token)).toEqual({
      issuedAt: ISSUED,
      expiresAt: ISSUED + 3600,
    });
  });

  it('no renueva antes de la mitad de la vida del token', () => {
    expect(needsRenewal(token, (ISSUED + 1799) * 1000)).toBe(false);
  });

  it('renueva desde la mitad de la vida del token', () => {
    expect(needsRenewal(token, (ISSUED + 1800) * 1000)).toBe(true);
    expect(needsRenewal(token, (ISSUED + 4000) * 1000)).toBe(true);
  });

  it('un token que no se puede leer no se renueva', () => {
    expect(needsRenewal('no-es-un-jwt', Date.now())).toBe(false);
    expect(needsRenewal(jwtWith({ sub: 3 }), Date.now())).toBe(false);
  });

  it('lee un payload con caracteres de base64url', () => {
    const name = 'Exportación ~~~ ???';
    const withSymbols = jwtWith({ name, iat: ISSUED, exp: ISSUED + 60 });

    expect(tokenLifetime(withSymbols)).toEqual({
      issuedAt: ISSUED,
      expiresAt: ISSUED + 60,
    });
  });
});
