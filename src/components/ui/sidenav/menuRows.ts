import type { SidenavMenuItem } from './sidenav-items';

export interface MenuRow {
  entry: SidenavMenuItem;
  add?: SidenavMenuItem;
}

const normalize = (s: string): string =>
  s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().trim();

const singular = (s: string): string => {
  if (s.endsWith('es')) return s.slice(0, -2);
  if (s.endsWith('s')) return s.slice(0, -1);
  return s;
};

const ADD = /^(agregar|añadir|crear)\s+/i;

const isAdd = (label: string): boolean => ADD.test(label);
const entityOf = (label: string): string =>
  singular(normalize(label.replace(ADD, '')));

// A list and its "Agregar …" page share one row, with the add page as a +
// button; the rows keep the menu's order.
export function menuRows(menu: SidenavMenuItem[]): MenuRow[] {
  const adds = new Map<string, SidenavMenuItem>();
  const listed = new Set(
    menu.filter((m) => !isAdd(m.label)).map((m) => entityOf(m.label))
  );
  menu.forEach((m) => {
    if (isAdd(m.label) && listed.has(entityOf(m.label))) {
      adds.set(entityOf(m.label), m);
    }
  });
  return menu
    .filter((m) => !(isAdd(m.label) && adds.get(entityOf(m.label)) === m))
    .map((m) => ({
      entry: m,
      add: isAdd(m.label) ? undefined : adds.get(entityOf(m.label)),
    }));
}
