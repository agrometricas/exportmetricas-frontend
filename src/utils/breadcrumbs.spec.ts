import { describe, expect, it } from 'vitest';
import { generateBreadcrumbs } from './breadcrumbs';

const names = (path: string): string[] =>
  generateBreadcrumbs(path).map((crumb) => crumb.name);

describe('migas de pan', () => {
  it('empiezan siempre en Inicio', () => {
    expect(names('/dashboard')).toEqual(['Inicio']);
    expect(names('/dashboard/export/search')[0]).toBe('Inicio');
  });

  it('llevan del alta de una marca a la lista de alícuotas', () => {
    const crumbs = generateBreadcrumbs('/dashboard/box-brands/add-brand');

    expect(crumbs.map((crumb) => crumb.name)).toEqual([
      'Inicio',
      'Alícuotas',
      'Agregar marca',
    ]);
    expect(crumbs[1].href).toBe('/dashboard/box-brands/search');
  });

  it('enlazan siempre dentro del panel', () => {
    const crumbs = generateBreadcrumbs('/dashboard/winery/stock-movements');

    expect(crumbs.every((crumb) => crumb.href.startsWith('/dashboard'))).toBe(
      true
    );
  });

  it('nombran la edición de un contrato naviero sin repetir la lista', () => {
    expect(names('/dashboard/client/shipping-contracts/10')).toEqual([
      'Inicio',
      'Contratos navieros',
      'Editar contrato naviero',
    ]);
  });

  it('nombran la edición de un contrato de productor sin repetir la lista', () => {
    expect(names('/dashboard/producer/contracts/16')).toEqual([
      'Inicio',
      'Contratos',
      'Editar contrato de productor',
    ]);
  });

  it('llevan del cambio de ubicación al perfil del mismo usuario', () => {
    const crumbs = generateBreadcrumbs('/dashboard/user/update-user/2');

    expect(crumbs.map((crumb) => crumb.name)).toEqual([
      'Inicio',
      'Perfil',
      'Modificar ubicación',
    ]);
    expect(crumbs[1].href).toBe('/dashboard/user/2');
    expect(crumbs[2].isCurrent).toBe(true);
  });

  it('traducen el registro inicial', () => {
    expect(names('/dashboard/onboarding')).toEqual([
      'Inicio',
      'Registro inicial',
    ]);
  });
});
