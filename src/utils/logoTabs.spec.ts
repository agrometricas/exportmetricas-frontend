import { describe, expect, it } from 'vitest';
import { logoTabIndex } from './logoTabs';

describe('pantalla de logos', () => {
  it('abre en la pestaña que pide el enlace', () => {
    expect(logoTabIndex('productores')).toBe(1);
    expect(logoTabIndex('alicuotas')).toBe(2);
  });

  it('sin pestaña, o con una que no existe, abre la de la exportadora', () => {
    expect(logoTabIndex(null)).toBe(0);
    expect(logoTabIndex('clientes')).toBe(0);
  });
});
