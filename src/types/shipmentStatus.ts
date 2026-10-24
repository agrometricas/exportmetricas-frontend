export type ChecklistStatus = 'OK' | 'PENDING' | 'REJECTED';

export type Semaphore = 'GREEN' | 'YELLOW' | 'RED';

export interface ChecklistItem {
  document: string;
  scope: string;
  status: ChecklistStatus;
  detail: string | null;
}

export interface BookingDocumentStatus {
  bookingId: number;
  bookingNumber: string;
  shipName: string;
  etd: string;
  shippingCompany: string;
  destination: string;
  semaphore: Semaphore;
  statusLabel: string;
  blocked: boolean;
  progress: number;
  items: ChecklistItem[];
  missing: ChecklistItem[];
}
