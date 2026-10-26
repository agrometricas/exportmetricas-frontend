import { formatDayMonthYearTime } from './dayMonthYear';
import { DocumentStatus } from '../types/bookingDocument';

export const DOCUMENT_STATUS_COLOR: Record<DocumentStatus, string> = {
  VALID: 'green',
  EXPIRING: 'orange',
  EXPIRED: 'red',
  NO_EXPIRY: 'gray',
};

export function documentStatusText(
  status: DocumentStatus,
  daysLeft: number | null
): string {
  if (status === 'NO_EXPIRY' || daysLeft === null) return 'Sin vencimiento';
  if (daysLeft < 0) {
    return daysLeft === -1 ? 'Venció ayer' : `Venció hace ${-daysLeft} días`;
  }
  if (daysLeft === 0) return 'Vence hoy';
  if (daysLeft === 1) return 'Vence mañana';
  return `Vence en ${daysLeft} días`;
}

export function documentTrace(document: {
  createdAt: string;
  uploadedBy: string | null;
  sha256: string | null;
}): string {
  const who = document.uploadedBy ?? 'Sin registro de quién lo subió';
  const when = formatDayMonthYearTime(document.createdAt);
  const hash = document.sha256
    ? ` · huella ${document.sha256.slice(0, 12)}…`
    : '';
  return `${who}, ${when}${hash}`;
}
