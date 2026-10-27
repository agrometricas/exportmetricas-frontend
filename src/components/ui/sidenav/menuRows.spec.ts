import { describe, expect, it } from 'vitest';
import { menuRows } from './menuRows';

const entry = (label: string): { label: string; to: string } => ({
  label,
  to: `/${label}`,
});

describe('filas del menú lateral', () => {
  it('cada lista lleva su página de agregar como botón, en el orden del menú', () => {
    const rows = menuRows([
      entry('Órdenes de Compra'),
      entry('Agregar Órdenes de Compra'),
      entry('Documentos'),
      entry('Exportaciones'),
      entry('Agregar Exportaciones'),
    ]);

    expect(rows.map((r) => [r.entry.label, r.add?.label])).toEqual([
      ['Órdenes de Compra', 'Agregar Órdenes de Compra'],
      ['Documentos', undefined],
      ['Exportaciones', 'Agregar Exportaciones'],
    ]);
  });

  it('empareja aunque cambie el número o las tildes', () => {
    const rows = menuRows([entry('Productores'), entry('Agregar Productor')]);

    expect(rows).toHaveLength(1);
    expect(rows[0].add?.label).toBe('Agregar Productor');
  });

  it('una página de agregar sin su lista queda como fila propia', () => {
    const rows = menuRows([entry('Fincas'), entry('Agregar Cuenta Bancaria')]);

    expect(rows.map((r) => r.entry.label)).toEqual([
      'Fincas',
      'Agregar Cuenta Bancaria',
    ]);
  });
});
