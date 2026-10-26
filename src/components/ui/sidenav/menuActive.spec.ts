import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import {
  activeSectionTab,
  isMenuEntryActive,
  isPathUnder,
  sectionTabPaths,
} from './menuActive';
import { LOGISTICS_TABS, QUALITY_CATALOG_TABS } from './navMenus';

const TABS = [
  { label: 'Puertos', to: '/dashboard/client/harbors', add: '/dashboard/client/add-harbor' },
  { label: 'Tarifas', to: '/dashboard/client/transport-rates' },
];

describe('menú lateral', () => {
  it('una ruta está dentro de otra solo si es ella o cuelga de ella', () => {
    expect(isPathUnder('/dashboard/client/harbors', '/dashboard/client/harbors')).toBe(true);
    expect(isPathUnder('/dashboard/client/harbors/3', '/dashboard/client/harbors')).toBe(true);
    expect(isPathUnder('/dashboard/client/harbors-old', '/dashboard/client/harbors')).toBe(false);
  });

  it('una entrada con pestañas queda marcada en cualquiera de sus páginas', () => {
    const entry = { to: TABS[0].to, match: sectionTabPaths(TABS) };
    expect(isMenuEntryActive('/dashboard/client/transport-rates', entry)).toBe(true);
    expect(isMenuEntryActive('/dashboard/client/add-harbor', entry)).toBe(true);
    expect(isMenuEntryActive('/dashboard/client/clients', entry)).toBe(false);
  });

  it('la pestaña activa es la de la lista o la de su alta', () => {
    expect(activeSectionTab('/dashboard/client/transport-rates', TABS)).toBe(1);
    expect(activeSectionTab('/dashboard/client/add-harbor', TABS)).toBe(0);
    expect(activeSectionTab('/dashboard/client/clients', TABS)).toBe(-1);
  });

  it('cada pestaña apunta a una página que existe', () => {
    for (const path of sectionTabPaths([...LOGISTICS_TABS, ...QUALITY_CATALOG_TABS])) {
      expect(existsSync(join('src/app', path, 'page.tsx')), path).toBe(true);
    }
  });
});
