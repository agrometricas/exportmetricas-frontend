import { BoxBrandCargoBody, CargoType } from '../types/boxType';

export const CARGO_TYPE_OPTIONS: { id: CargoType; name: string }[] = [
  { id: 'CONTAINER', name: 'Contenedor' },
  { id: 'BULK', name: 'Granel' },
];

export const cargoTypeLabel = (cargoType?: CargoType | null): string =>
  CARGO_TYPE_OPTIONS.find((option) => option.id === cargoType)?.name ?? '—';

export const boxQuantityLabel = (cargoType: CargoType | ''): string =>
  cargoType === 'BULK'
    ? 'Base de referencia (cajas)'
    : 'Número de cajas/contenedor';

export function cargoBody(values: {
  cargoType: CargoType | '';
  boxTypeId: number | string | '';
}): BoxBrandCargoBody {
  return {
    cargoType: values.cargoType || 'CONTAINER',
    ...(values.boxTypeId ? { boxTypeId: Number(values.boxTypeId) } : {}),
  };
}

// The backend rejects a bulk box brand that names a pallet, so the hidden
// pallet fields go out empty whatever they held before the switch.
export const NO_PALLETS = {
  palletsTypeId: 0,
  palletsTypeQuantity: 0,
  miniPalletsTypeId: 0,
  miniPalletsTypeQuantity: 0,
};
