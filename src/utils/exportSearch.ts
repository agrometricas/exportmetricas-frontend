import { formatDayMonthYear } from './dayMonthYear';
import { ExportSearchHit } from '../types/exportSearch';

// The backend answers [] below this; asking would only cost a request.
export function isSearchable(q: string): boolean {
  const text = q.trim();
  return text.length >= 2 || /^\d+$/.test(text);
}

export function searchHitSummary(hit: ExportSearchHit): {
  title: string;
  detail: string;
  logistics: string;
} {
  const cut = formatDayMonthYear(hit.cuttingDate);
  return {
    title: `Exportación N.º ${hit.exportId}`,
    detail: [hit.farm, hit.client, cut ? `corte ${cut}` : '']
      .filter(Boolean)
      .join(' · '),
    logistics: [
      hit.bookingNumber ? `booking ${hit.bookingNumber}` : '',
      hit.containers.length ? hit.containers.join(', ') : '',
    ]
      .filter(Boolean)
      .join(' · '),
  };
}
