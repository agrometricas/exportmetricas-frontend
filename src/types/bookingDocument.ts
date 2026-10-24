export type DocumentStatus = 'NO_EXPIRY' | 'VALID' | 'EXPIRING' | 'EXPIRED';

export type BookingDocumentType =
  | 'BILL_OF_LADING'
  | 'PHYTOSANITARY'
  | 'ORIGIN_CERTIFICATE'
  | 'CONTAINER_INSPECTION'
  | 'DAE'
  | 'INSURANCE'
  | 'SANITARY';

export interface DocumentTypeOption {
  type: BookingDocumentType;
  label: string;
  needsExpiry: boolean;
  needsContainer: boolean;
}

export interface DocumentSummary {
  type: BookingDocumentType;
  typeLabel: string;
  number: string;
  expiresAt: string | null;
  status: DocumentStatus;
  daysLeft: number | null;
}

export interface BookingDocument extends DocumentSummary {
  id: number;
  createdAt: string;
  issuedAt: string | null;
  containerId: number | null;
  containerNumber: string | null;
  fileName: string;
  fileUrl: string;
  sha256: string | null;
  uploadedBy: string | null;
}
