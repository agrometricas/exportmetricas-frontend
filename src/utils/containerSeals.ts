import { ContainerSealsBody } from '../types/booking';

export interface SealsValues {
  shippingLineSeal: string;
  extraSeals: string;
}

export function sealsValues(container: {
  shippingLineSeal?: string | null;
  extraSeals?: string[];
}): SealsValues {
  return {
    shippingLineSeal: container.shippingLineSeal ?? '',
    extraSeals: (container.extraSeals ?? []).join(', '),
  };
}

// The extra seals are typed in one field, separated by commas.
export function sealsBody(values: SealsValues): ContainerSealsBody {
  return {
    shippingLineSeal: values.shippingLineSeal.trim() || null,
    extraSeals: values.extraSeals
      .split(',')
      .map((seal) => seal.trim())
      .filter(Boolean),
  };
}

export function containerLabel(container: {
  number: string;
  shippingLineSeal?: string | null;
  extraSeals?: string[];
}): string {
  const seals = [
    container.shippingLineSeal && `sello ${container.shippingLineSeal}`,
    container.extraSeals?.length && `extra ${container.extraSeals.join(', ')}`,
  ].filter(Boolean);
  return seals.length > 0
    ? `${container.number} (${seals.join('; ')})`
    : container.number;
}
