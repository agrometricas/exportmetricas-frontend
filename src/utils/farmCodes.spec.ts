import { describe, expect, it } from 'vitest';
import { farmCodeSchema, isFarmCode } from './farmCodes';

describe('códigos de la finca', () => {
  it('el MAGAP tiene 6 letras o números', () => {
    expect(isFarmCode('MAGAP', 'MAG045')).toBe(true);
    expect(isFarmCode('MAGAP', 'MAG0457')).toBe(false);
    expect(isFarmCode('MAGAP', 'MAG-45')).toBe(false);
  });

  it('el AGROCALIDAD tiene de 6 a 12 letras o números', () => {
    expect(isFarmCode('AGROCALIDAD', 'AGR991204')).toBe(true);
    expect(isFarmCode('AGROCALIDAD', 'A1B2C3D4E5F6')).toBe(true);
    expect(isFarmCode('AGROCALIDAD', 'AGR99')).toBe(false);
    expect(isFarmCode('AGROCALIDAD', 'AGR 991204')).toBe(false);
  });

  it('al editar, un código guardado antes de la regla se acepta tal cual', async () => {
    const schema = farmCodeSchema('MAGAP', 'MAG-0457-X');
    await expect(schema.validate('MAG-0457-X')).resolves.toBe('MAG-0457-X');
    await expect(schema.validate('MAG-0458-X')).rejects.toThrow(
      'Debe tener 6 letras o números, sin espacios'
    );
  });
});
