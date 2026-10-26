import { describe, expect, it } from 'vitest';
import { ROLE_OPTIONS, roleLabel } from './roles';

describe('nombres de los roles', () => {
  it('cada rol se muestra con su nombre en español', () => {
    expect(roleLabel('MASTER')).toBe('Principal');
    expect(roleLabel('ADMINISTRATIVE')).toBe('Administrativo');
  });

  it('un rol que la web no conoce se muestra tal cual', () => {
    expect(roleLabel('AUDITOR')).toBe('AUDITOR');
  });

  it('el selector ofrece los cinco roles', () => {
    expect(ROLE_OPTIONS.map(({ id }) => id)).toEqual([
      'MASTER',
      'LOGISTICS',
      'EXPORT',
      'QUALITY',
      'ADMINISTRATIVE',
    ]);
  });
});
