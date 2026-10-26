import { StepKey } from '../types/exportProgress';

export type QueueKey = StepKey | 'documents';

// The same areas the side menu gives each role.
const AREA_OF: Record<QueueKey, string> = {
  supplies: 'EXPORT',
  customs: 'EXPORT',
  documents: 'EXPORT',
  booking: 'EXPORT',
  cuttingSheet: 'QUALITY',
  costs: 'ADMINISTRATIVE',
  producerPayment: 'ADMINISTRATIVE',
  clientPayment: 'ADMINISTRATIVE',
};

export function seesQueue(role: string | undefined, key: QueueKey): boolean {
  return role === 'MASTER' || AREA_OF[key] === role;
}

export const QUEUE_LIST_PAGE: Record<QueueKey, string> = {
  supplies: '/dashboard/liquidation/add-supply-shipment',
  cuttingSheet: '/dashboard/export/add-cutting-sheet',
  customs: '/dashboard/export/search',
  costs: '/dashboard/liquidation/add-export-cost',
  producerPayment: '/dashboard/liquidation/producer-pending-payments',
  clientPayment: '/dashboard/liquidation/client-pending-payments',
  documents: '/dashboard/export/documents',
  booking: '/dashboard/export/bookings',
};
