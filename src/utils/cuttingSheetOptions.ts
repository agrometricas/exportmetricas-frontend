export interface SheetOption {
  id: string;
  name: string;
}

const PALLET_HEIGHTS = [
  'PALETS 8 DE ALTO',
  'PALETS 9 DE ALTO',
  'PALETS 10 DE ALTO',
];

export const CONTAINER_POSITIONS: SheetOption[] = [
  { id: 'N/A', name: 'N/A' },
  { id: 'CAMPO', name: 'CAMPO' },
  { id: 'ACOPIO', name: 'ACOPIO' },
];

const asOption = (value: string): SheetOption => ({ id: value, name: value });

// The value already saved on a sheet stays selectable even if the box brand
// changed since, so a correction does not silently drop it.
export function palletsHeightOptions(
  hasPallets: boolean,
  current?: string
): SheetOption[] {
  const options = (hasPallets ? PALLET_HEIGHTS : ['N/A']).map(asOption);
  return current && !options.some((option) => option.id === current)
    ? [asOption(current), ...options]
    : options;
}

export function belowDeckFor(containerPositioning: string): string {
  if (containerPositioning === 'CAMPO') return 'NO';
  if (containerPositioning === 'ACOPIO') return 'SI';
  return 'N/A';
}

export function sheetVersionLabel(version: number): string {
  return version > 1 ? `CORREGIDA v${version}` : 'Original';
}
