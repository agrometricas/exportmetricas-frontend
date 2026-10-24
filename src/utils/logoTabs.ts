export const LOGO_TABS = [
  { key: 'exportadora', label: 'Exportadora' },
  { key: 'productores', label: 'Productores' },
  { key: 'alicuotas', label: 'Alícuotas' },
] as const;

export type LogoTab = (typeof LOGO_TABS)[number]['key'];

export function logoTabIndex(tab: string | null): number {
  const index = LOGO_TABS.findIndex(({ key }) => key === tab);
  return index === -1 ? 0 : index;
}
