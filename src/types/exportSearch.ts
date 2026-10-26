export interface ExportSearchHit {
  exportId: number;
  cuttingDate: string | null;
  farm: string;
  producer: string;
  client: string;
  bookingNumber: string | null;
  containers: string[];
  cancelled: boolean;
}
