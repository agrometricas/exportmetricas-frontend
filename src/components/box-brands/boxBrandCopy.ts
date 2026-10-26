export type MaterialSection = 'box' | 'container' | 'additions';

export const OPTIONAL_MATERIALS: {
  field: string;
  label: string;
  section: MaterialSection;
}[] = [
  { field: 'parasealTypeId', label: 'ParaSeal', section: 'box' },
  { field: 'padTypeId', label: 'Mini Pad', section: 'box' },
  { field: 'spongeTypeId', label: 'Esponja', section: 'box' },
  { field: 'labelId', label: 'Etiqueta', section: 'box' },
  { field: 'bandId', label: 'Banda', section: 'box' },
  { field: 'sachetId', label: 'Sachet', section: 'box' },
  { field: 'rubberId', label: 'Liga', section: 'box' },
  { field: 'protectorId', label: 'Protector', section: 'box' },
  { field: 'clusterBagId', label: 'Cluster Bag', section: 'box' },
  { field: 'cornerTypeId', label: 'Esquineros', section: 'container' },
  { field: 'reinforcementTypeId', label: 'Refuerzo', section: 'container' },
  { field: 'stapleId', label: 'Grapa', section: 'container' },
  { field: 'strippingId', label: 'Zuncho', section: 'container' },
  { field: 'thermographId', label: 'Termógrafo', section: 'container' },
  { field: 'sealId', label: 'Sello', section: 'container' },
  { field: 'mettoLabelId', label: 'Etiqueta Metto', section: 'container' },
  {
    field: 'packingTapeTypeId',
    label: 'Cinta de embalaje',
    section: 'additions',
  },
  {
    field: 'latexRemoverId',
    label: 'Removedor de látex',
    section: 'additions',
  },
  {
    field: 'blockingSheetId',
    label: 'Lámina de bloqueo',
    section: 'additions',
  },
  {
    field: 'containerSealPlasticId',
    label: 'Plástico de cierre del contenedor',
    section: 'additions',
  },
  { field: 'securityKitId', label: 'Kit de seguridad', section: 'additions' },
  {
    field: 'boardingCardId',
    label: 'Tarjeta de embarque',
    section: 'additions',
  },
];

const MATERIAL_PAIRS = [
  'bottomType',
  'lidType',
  'coverType',
  'cardboardType',
  'parasealType',
  'padType',
  'spongeType',
  'label',
  'band',
  'sachet',
  'rubber',
  'protector',
  'clusterBag',
  'palletsType',
  'miniPalletsType',
  'cornerType',
  'reinforcementType',
  'staple',
  'stripping',
  'thermograph',
  'seal',
  'mettoLabel',
  'packingTapeType',
  'latexRemover',
  'blockingSheet',
  'containerSealPlastic',
  'securityKit',
  'boardingCard',
];

type Part = { quantity: number };
type SavedBoxBrand = Record<string, unknown> & {
  requiredCertificates?: { id: number }[];
  pesticideCocktail?: (Part & { pesticide: { id: number } })[];
  insecticideCocktail?: (Part & { insecticide: { id: number } })[];
  stickerCocktail?: (Part & { sticker: { id: number } })[];
  sheetCocktail?: (Part & { sheet: { id: number } })[];
};

const orEmpty = (value: unknown): unknown =>
  value === null || value === undefined ? '' : value;

// A new box brand starting from a saved one: every material, quantity and
// cocktail, with its own name and code still to be written.
export function boxBrandCopyValues(
  saved: SavedBoxBrand
): Record<string, unknown> {
  const values: Record<string, unknown> = {
    name: '',
    brandCode: '',
    brandId: orEmpty(saved.brandId),
    boxQuantity: orEmpty(saved.boxQuantity),
    netWeightBox: orEmpty(saved.netWeightBox),
    grossWeightBox: orEmpty(saved.grossWeightBox),
    cargoType: saved.cargoType ?? 'CONTAINER',
    boxTypeId: orEmpty(saved.boxTypeId),
    requiredCertificates: (saved.requiredCertificates ?? []).map(
      ({ id }) => id
    ),
    pesticides: (saved.pesticideCocktail ?? []).map((part) => ({
      pesticideId: part.pesticide.id,
      quantity: part.quantity,
    })),
    insecticides: (saved.insecticideCocktail ?? []).map((part) => ({
      insecticideId: part.insecticide.id,
      quantity: part.quantity,
    })),
    stickers: (saved.stickerCocktail ?? []).map((part) => ({
      stickerId: part.sticker.id,
      quantity: part.quantity,
    })),
    sheets: (saved.sheetCocktail ?? []).map((part) => ({
      sheetId: part.sheet.id,
      quantity: part.quantity,
    })),
  };
  // A quantity never saved is 0, as in a new form: a hidden optional row left
  // blank would fail validation where nobody can see it.
  for (const pair of MATERIAL_PAIRS) {
    values[`${pair}Id`] = orEmpty(saved[`${pair}Id`]);
    values[`${pair}Quantity`] = saved[`${pair}Quantity`] ?? 0;
  }
  return values;
}

export function usedOptionalMaterials(
  values: Record<string, unknown>
): string[] {
  return OPTIONAL_MATERIALS.filter(({ field }) => {
    const value = values[field];
    return value !== '' && value !== null && value !== undefined;
  }).map(({ field }) => field);
}
