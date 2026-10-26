export interface PendingSheet {
  id: number;
  export?: {
    id?: number;
    boxQuantity?: number;
    cuttingDate?: string | null;
    business?: { name?: string };
    boxBrand?: {
      id?: number;
      name?: string;
      palletsType?: { name?: string } | null;
      palletsTypeQuantity?: number | '' | null;
    };
  };
}

export interface SheetBatchRow {
  exportSentId: number;
  cuttingTypeId: string;
  palletsHeight: string;
  containerPositioning: string;
}

export interface CuttingSheetBatchItem {
  exportSentId: number;
  cuttingTypeId: number;
  palletsHeight: string;
  containerPositioning: string;
  belowDeck: string;
}

export interface CuttingSheetBatchResult {
  created: { exportSentId: number; cuttingSheetId: number; pdfUrl: string }[];
  failed: { exportSentId: number; message: string }[];
}
