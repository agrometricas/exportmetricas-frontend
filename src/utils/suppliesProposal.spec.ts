import { describe, expect, it } from 'vitest';
import { proposedQuantity } from './suppliesProposal';

const LINES = [
  { pesticideId: 3, quantity: 2160 },
  { pesticideId: 4, quantity: 500 },
];

describe('cantidad propuesta por el backend', () => {
  it('toma la cantidad de la línea del mismo material', () => {
    expect(proposedQuantity(LINES, 'pesticideId', 4)).toBe(500);
  });

  it('sin línea para ese material, o sin propuesta todavía, queda vacía', () => {
    expect(proposedQuantity(LINES, 'pesticideId', 9)).toBe('');
    expect(proposedQuantity(LINES, 'pesticideId', '')).toBe('');
    expect(proposedQuantity(undefined, 'pesticideId', 3)).toBe('');
  });
});
