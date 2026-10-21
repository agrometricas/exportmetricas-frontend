import {
  CustomsChannel,
  CustomsStep,
  ExportCustomsBody,
} from '../types/customs';

export const CUSTOMS_CHANNEL_OPTIONS: { id: CustomsChannel; name: string }[] = [
  { id: 'AUTOMATIC', name: 'Automático' },
  { id: 'ELECTRONIC', name: 'Electrónico' },
  { id: 'DOCUMENTARY', name: 'Documental' },
  { id: 'PHYSICAL', name: 'Físico intrusivo' },
];

export const customsChannelLabel = (channel?: CustomsChannel | null): string =>
  CUSTOMS_CHANNEL_OPTIONS.find((option) => option.id === channel)?.name ?? '—';

export const CUSTOMS_STEP: Record<
  CustomsStep,
  { label: string; colorScheme: string }
> = {
  PENDING: { label: 'Sin AUCP', colorScheme: 'gray' },
  AUCP: { label: 'AUCP', colorScheme: 'yellow' },
  DAE: { label: 'DAE', colorScheme: 'green' },
};

export interface CustomsValues {
  aucpNumber: string;
  aucpDate: string;
  daeNumber: string;
  daeDate: string;
  daeChannel: CustomsChannel | '';
}

export function customsBody(values: CustomsValues): ExportCustomsBody {
  const text = (value: string): string | null => value.trim() || null;
  return {
    aucpNumber: text(values.aucpNumber),
    aucpDate: values.aucpDate || null,
    daeNumber: text(values.daeNumber),
    daeDate: values.daeDate || null,
    daeChannel: values.daeChannel || null,
  };
}
