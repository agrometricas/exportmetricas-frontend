const UNIT_SHORT: Record<string, string> = {
  unidad: 'u',
  paquete: 'paq',
  caja: 'caja',
  rollo: 'rollo',
  metro: 'm',
  kg: 'kg',
  g: 'g',
  lb: 'lb',
  litro: 'L',
  ml: 'ml',
  galón: 'gal',
};

export type QuantityBase = 'caja' | 'contenedor';

// The suffix inside a box brand quantity input: what the unit is counted
// against, kept short so it fits in the field.
export function quantityUnit(unit: string | undefined, base: QuantityBase): string {
  const short = (unit && UNIT_SHORT[unit]) || unit || 'u';
  return `${short}/${base === 'caja' ? 'caja' : 'cont.'}`;
}

// Which material type each BoxBrand quantity counts, and against what: the
// container materials are counted per container, the rest per box.
export const QUANTITY_FIELDS: Record<string, { type: string; base: QuantityBase }> = {
  bottomTypeQuantity: { type: 'BOTTOM', base: 'caja' },
  lidTypeQuantity: { type: 'LID', base: 'caja' },
  coverTypeQuantity: { type: 'COVER', base: 'caja' },
  cardboardTypeQuantity: { type: 'CARDBOARD', base: 'caja' },
  parasealTypeQuantity: { type: 'PARASEAL', base: 'caja' },
  padTypeQuantity: { type: 'PAD', base: 'caja' },
  spongeTypeQuantity: { type: 'SPONGE', base: 'caja' },
  labelQuantity: { type: 'LABEL', base: 'caja' },
  bandQuantity: { type: 'BAND', base: 'caja' },
  sachetQuantity: { type: 'SACCHET', base: 'caja' },
  rubberQuantity: { type: 'RUBBER', base: 'caja' },
  protectorQuantity: { type: 'PROTECTOR', base: 'caja' },
  clusterBagQuantity: { type: 'CLUSTER_BAG', base: 'caja' },
  palletsTypeQuantity: { type: 'PALLET', base: 'contenedor' },
  miniPalletsTypeQuantity: { type: 'MINI_PALLET', base: 'contenedor' },
  cornerTypeQuantity: { type: 'CORNER', base: 'contenedor' },
  reinforcementTypeQuantity: { type: 'REINFORCEMENT', base: 'contenedor' },
  stapleQuantity: { type: 'STAPLE', base: 'contenedor' },
  strippingQuantity: { type: 'STRIPPING', base: 'contenedor' },
  thermographQuantity: { type: 'THERMOGRAPH', base: 'contenedor' },
  sealQuantity: { type: 'SEAL', base: 'contenedor' },
  mettoLabelQuantity: { type: 'METTO_LABEL', base: 'contenedor' },
  packingTapeTypeQuantity: { type: 'PACKING_TAPE', base: 'contenedor' },
  latexRemoverQuantity: { type: 'LATEX_REMOVER', base: 'contenedor' },
  blockingSheetQuantity: { type: 'BLOCKING_SHEET', base: 'contenedor' },
  containerSealPlasticQuantity: { type: 'CONTAINER_SEAL_PLASTIC', base: 'contenedor' },
  securityKitQuantity: { type: 'SECURITY_KIT', base: 'contenedor' },
  boardingCardQuantity: { type: 'BOARDING_CARD', base: 'contenedor' },
};
