export interface CuttingSheetType {
  exportSentId: number | '' | undefined;
  cuttingTypeId: number;
  palletsHeight: string;
  containerPositioning: string;
  belowDeck: string;
}

export interface CorrectCuttingSheetBody {
  cuttingTypeId: number;
  palletsHeight: string;
  containerPositioning: string;
  belowDeck: string;
  reason: string;
}

export interface CuttingSheetDelivery {
  id: number;
  version: number;
  pdfUrl: string;
  emailRecipients: string[];
}
