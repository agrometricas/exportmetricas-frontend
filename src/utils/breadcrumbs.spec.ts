import { describe, expect, it } from 'vitest';
import { generateBreadcrumbs } from './breadcrumbs';

const names = (path: string): string[] =>
  generateBreadcrumbs(path).map((crumb) => crumb.name);

describe('migas de pan', () => {
  it('empiezan siempre en Inicio', () => {
    expect(names('/dashboard')).toEqual(['Inicio']);
    expect(names('/dashboard/export/search')[0]).toBe('Inicio');
  });

  it('traducen el alta de una marca', () => {
    expect(names('/dashboard/box-brands/add-brand')).toEqual([
      'Inicio',
      'Marcas de Caja',
      'Agregar Marca',
    ]);
  });

  it('nombran la edición de un contrato naviero sin repetir la lista', () => {
    expect(names('/dashboard/client/shipping-contracts/10')).toEqual([
      'Inicio',
      'Contratos Navieros',
      'Editar Contrato Naviero',
    ]);
  });

  it('nombran la edición de un contrato de productor sin repetir la lista', () => {
    expect(names('/dashboard/producer/contracts/16')).toEqual([
      'Inicio',
      'Contratos',
      'Editar Contrato de Productor',
    ]);
  });

  it('llevan del cambio de ubicación al perfil del mismo usuario', () => {
    const crumbs = generateBreadcrumbs('/dashboard/user/update-user/2');

    expect(crumbs.map((crumb) => crumb.name)).toEqual([
      'Inicio',
      'Perfil',
      'Modificar Ubicación',
    ]);
    expect(crumbs[1].href).toBe('/dashboard/user/2');
    expect(crumbs[2].isCurrent).toBe(true);
  });

  it('traducen el registro inicial', () => {
    expect(names('/dashboard/onboarding')).toEqual([
      'Inicio',
      'Registro Inicial',
    ]);
  });
});
