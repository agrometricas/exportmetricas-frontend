import { describe, expect, it } from 'vitest';
import {
  MATERIAL_TYPE_LABELS,
  MATERIAL_TYPE_ORDER,
} from './materialTypeLabels';

describe('tipos de material', () => {
  it('todo tipo con nombre tiene su lugar en el orden, y al revés', () => {
    expect([...MATERIAL_TYPE_ORDER].sort()).toEqual(
      Object.keys(MATERIAL_TYPE_LABELS).sort()
    );
  });

  it('ningún tipo aparece dos veces en el orden', () => {
    expect(new Set(MATERIAL_TYPE_ORDER).size).toBe(MATERIAL_TYPE_ORDER.length);
  });

  it('los cuatro materiales obligatorios de una caja van primero', () => {
    expect(MATERIAL_TYPE_ORDER.slice(0, 4)).toEqual([
      'BOTTOM',
      'LID',
      'COVER',
      'CARDBOARD',
    ]);
  });
});
