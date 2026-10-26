import { describe, expect, it } from 'vitest';
import { idsToSelection, selectionToIds, toggleId } from './selection';

describe('selección de una lista', () => {
  it('marcar dos veces el mismo elemento lo saca de la selección', () => {
    expect(toggleId([3, 5], 7)).toEqual([3, 5, 7]);
    expect(toggleId([3, 5, 7], 5)).toEqual([3, 7]);
  });

  it('la selección de una tabla va y vuelve como lista de ids', () => {
    expect(selectionToIds({ '3': true, '5': false, '7': true })).toEqual([
      3, 7,
    ]);
    expect(idsToSelection([3, 7])).toEqual({ '3': true, '7': true });
    expect(selectionToIds(idsToSelection([12, 40]))).toEqual([12, 40]);
  });
});
