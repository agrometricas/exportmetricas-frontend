import { describe, expect, it } from 'vitest';
import { toggleId } from './selection';

describe('selección de una lista', () => {
  it('marcar dos veces el mismo elemento lo saca de la selección', () => {
    expect(toggleId([3, 5], 7)).toEqual([3, 5, 7]);
    expect(toggleId([3, 5, 7], 5)).toEqual([3, 7]);
  });
});
