import {
  ChecklistItem,
  ChecklistStatus,
  Semaphore,
} from '../types/shipmentStatus';

export const SEMAPHORE_COLOR: Record<Semaphore, string> = {
  GREEN: 'green',
  YELLOW: 'yellow',
  RED: 'red',
};

export const CHECKLIST_STATUS: Record<
  ChecklistStatus,
  { label: string; colorScheme: string }
> = {
  OK: { label: 'Listo', colorScheme: 'green' },
  PENDING: { label: 'Falta', colorScheme: 'yellow' },
  REJECTED: { label: 'Rechazado', colorScheme: 'red' },
};

export function missingSummary(missing: ChecklistItem[], shown = 2): string[] {
  const lines = missing
    .slice(0, shown)
    .map(({ document, scope, detail }) =>
      scope === 'Booking'
        ? (detail ?? document)
        : `${scope}: ${detail ?? document}`
    );
  if (missing.length > shown) lines.push(`y ${missing.length - shown} más`);
  return lines;
}
