export interface SectionTab {
  label: string;
  to: string;
  add?: string;
}

export function isPathUnder(pathname: string, path: string): boolean {
  return pathname === path || pathname.startsWith(path + '/');
}

export function isMenuEntryActive(
  pathname: string,
  entry: { to: string; match?: string[] }
): boolean {
  return [entry.to, ...(entry.match ?? [])].some((path) =>
    isPathUnder(pathname, path)
  );
}

export function sectionTabPaths(tabs: SectionTab[]): string[] {
  return tabs.flatMap((tab) => (tab.add ? [tab.to, tab.add] : [tab.to]));
}

export function activeSectionTab(pathname: string, tabs: SectionTab[]): number {
  return tabs.findIndex((tab) =>
    sectionTabPaths([tab]).some((path) => isPathUnder(pathname, path))
  );
}
