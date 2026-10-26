import { CuttingType } from '../types/cuttingType';

const NUMBER_FIELDS = [
  'leavesAtHarvest',
  'maxAgeAtCut',
  'minCaliber',
  'maxCaliber',
] as const;

const TEXT_FIELDS = [
  'quality',
  'shipmentType',
  'fingerLength',
  'saneos',
  'cunas',
  'clusterDetail',
  'labelDetail',
  'firstLine',
  'secondLine',
  'thirdLine',
  'fourthLine',
  'packagingPattern',
  'palletDetail',
  'cornerProtectorsDetail',
  'reinforcementsDetail',
  'plasticStrapsDetail',
  'staplesDetail',
  'blockingSheetsDetail',
  'transportDetail',
  'generalObservations',
] as const;

type NumberField = (typeof NUMBER_FIELDS)[number];
type TextField = (typeof TEXT_FIELDS)[number];

export type CuttingTypeFormValues = Record<NumberField | TextField, string> & {
  boxBrandId: number | '';
};

export type CuttingTypeBody = Record<NumberField, number> &
  Record<TextField, string> & { boxBrandId: number };

export const EMPTY_CUTTING_TYPE: CuttingTypeFormValues = {
  ...(Object.fromEntries(
    [...NUMBER_FIELDS, ...TEXT_FIELDS].map((field) => [field, ''])
  ) as Record<NumberField | TextField, string>),
  boxBrandId: '',
};

export function cuttingTypeFormValues(
  cuttingType: CuttingType
): CuttingTypeFormValues {
  const values = { ...EMPTY_CUTTING_TYPE };
  for (const field of NUMBER_FIELDS) {
    values[field] = String(cuttingType[field] ?? '');
  }
  for (const field of TEXT_FIELDS) {
    values[field] = cuttingType[field] ?? '';
  }
  values.boxBrandId = cuttingType.boxBrandId ?? '';
  return values;
}

export function cuttingTypeBody(
  values: CuttingTypeFormValues
): CuttingTypeBody {
  const body = { boxBrandId: Number(values.boxBrandId) } as CuttingTypeBody;
  for (const field of NUMBER_FIELDS) body[field] = Number(values[field]);
  for (const field of TEXT_FIELDS) body[field] = values[field].trim();
  return body;
}

type Option = { id: string; name: string };

// A value saved before the lists existed is still offered, so editing keeps
// it unless the user picks another one.
export function optionsWithSaved(options: Option[], saved?: string): Option[] {
  if (!saved || options.some(({ id }) => id === saved)) return options;
  return [...options, { id: saved, name: saved }];
}
