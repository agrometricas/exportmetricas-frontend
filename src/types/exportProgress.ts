import { BookingDocumentStatus } from './shipmentStatus';

export type StepKey =
  | 'booking'
  | 'supplies'
  | 'cuttingSheet'
  | 'customs'
  | 'costs'
  | 'producerPayment'
  | 'clientPayment';

export type StepStatus = 'DONE' | 'TODO' | 'WAITING' | 'OPTIONAL';

export interface ProgressStep {
  key: StepKey;
  label: string;
  status: StepStatus;
  detail: string | null;
}

export interface ExportProgress {
  exportId: number;
  exportSentId: number | null;
  bookingId: number | null;
  state: 'CANCELLED' | 'IN_PROGRESS' | 'CLOSED';
  stateLabel: string;
  progress: number;
  next: StepKey | null;
  steps: ProgressStep[];
}

export interface QueueExport {
  exportId: number;
  exportSentId: number | null;
  farm: string;
  producer: string;
  client: string;
  boxes: number;
  cuttingDate: string | null;
  booking: string | null;
}

export interface WorkQueue {
  groups: {
    key: StepKey;
    label: string;
    count: number;
    exports: QueueExport[];
  }[];
  documents: { count: number; bookings: BookingDocumentStatus[] };
}
