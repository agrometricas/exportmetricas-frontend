import { describe, expect, it } from 'vitest';
import { harborPlace } from './harborPlace';

describe('lugar de un puerto', () => {
  it('lleva la ciudad y el país entre paréntesis', () => {
    expect(
      harborPlace({
        name: 'Guayaquil',
        city: { name: 'Guayaquil' },
        country: { name: 'Ecuador' },
      })
    ).toBe('Guayaquil (Guayaquil, Ecuador)');
  });

  it('sin ciudad o sin país muestra lo que haya', () => {
    expect(
      harborPlace({
        name: 'Puerto Bolívar',
        city: null,
        country: { name: 'Ecuador' },
      })
    ).toBe('Puerto Bolívar (Ecuador)');
    expect(harborPlace({ name: 'Hamburgo', city: null, country: null })).toBe(
      'Hamburgo'
    );
  });
});
