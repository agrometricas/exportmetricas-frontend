import { describe, expect, it } from 'vitest';
import {
  belowDeckFor,
  palletsHeightOptions,
  sheetVersionLabel,
} from './cuttingSheetOptions';

describe('opciones de la hoja de corte', () => {
  it('con pallets se elige la altura; sin pallets solo queda N/A', () => {
    expect(palletsHeightOptions(true).map((option) => option.id)).toEqual([
      'PALETS 8 DE ALTO',
      'PALETS 9 DE ALTO',
      'PALETS 10 DE ALTO',
    ]);
    expect(palletsHeightOptions(false).map((option) => option.id)).toEqual([
      'N/A',
    ]);
  });

  it('el valor guardado en la hoja sigue en la lista aunque la alícuota haya cambiado', () => {
    expect(
      palletsHeightOptions(false, 'PALETS 9 DE ALTO').map((option) => option.id)
    ).toEqual(['PALETS 9 DE ALTO', 'N/A']);
    expect(palletsHeightOptions(true, 'PALETS 9 DE ALTO')).toHaveLength(3);
  });

  it('bajo cubierta sale de la posición del contenedor', () => {
    expect(belowDeckFor('CAMPO')).toBe('NO');
    expect(belowDeckFor('ACOPIO')).toBe('SI');
    expect(belowDeckFor('N/A')).toBe('N/A');
    expect(belowDeckFor('')).toBe('N/A');
  });

  it('la versión 1 es la original y las siguientes dicen CORREGIDA', () => {
    expect(sheetVersionLabel(1)).toBe('Original');
    expect(sheetVersionLabel(3)).toBe('CORREGIDA v3');
  });
});
