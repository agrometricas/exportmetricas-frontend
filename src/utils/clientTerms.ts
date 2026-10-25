export type TimeUnit = 'DAY' | 'WEEK' | 'MONTH' | 'YEAR';

export const VOLUME_PERIOD_OPTIONS: { id: TimeUnit; name: string }[] = [
  { id: 'WEEK', name: 'Por semana' },
  { id: 'MONTH', name: 'Por mes' },
  { id: 'YEAR', name: 'Por año' },
];

export const PAYMENT_UNIT_OPTIONS: { id: TimeUnit; name: string }[] = [
  { id: 'DAY', name: 'Días' },
  { id: 'WEEK', name: 'Semanas' },
  { id: 'MONTH', name: 'Meses' },
];

export type ClientTermValues = {
  purchaseVolumeBoxes: string;
  purchaseVolumePeriod: TimeUnit | '';
  paymentTermValue: string;
  paymentTermUnit: TimeUnit | '';
};

export type ClientTermsBody = {
  purchaseVolumeBoxes: number | null;
  purchaseVolumePeriod: TimeUnit | null;
  paymentTermValue: number | null;
  paymentTermUnit: TimeUnit | null;
};

const numberOrNull = (value: string): number | null =>
  value.trim() === '' ? null : Number(value);

export function clientTermsBody(values: ClientTermValues): ClientTermsBody {
  return {
    purchaseVolumeBoxes: numberOrNull(values.purchaseVolumeBoxes),
    purchaseVolumePeriod: values.purchaseVolumePeriod || null,
    paymentTermValue: numberOrNull(values.paymentTermValue),
    paymentTermUnit: values.paymentTermUnit || null,
  };
}
