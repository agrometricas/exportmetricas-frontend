interface Named {
  id: number;
  name: string;
}

export interface MinimumBoxPriceResponse {
  fasBoxPrice: string;
  fobBoxPrice: string;
  isDefault: boolean;
}

export interface MinimumBoxPriceBody {
  fasBoxPrice: number;
  fobBoxPrice: number;
}

export interface PriceSheetLine {
  exportId: number;
  merchant: { id: number; businessName: string; contractType: string };
  business: Named;
  boxBrand: Named & { brandCode: string };
  client: { id: number; businessName: string };
  cuttingDate: string | null;
  type: 'CONTRACT' | 'SPOT';
  editable: boolean;
  boxQuantity: number;
  price: string | null;
  proposedPrice: string;
  effectivePrice: string;
  total: string;
  belowMinimum: boolean;
  paidPrice: string | null;
}

export interface PriceSheet {
  weekStart: string;
  minimum: MinimumBoxPriceResponse;
  lines: PriceSheetLine[];
  totals: {
    contractBoxes: number;
    spotBoxes: number;
    boxes: number;
    amount: string;
  };
  warnings: string[];
}

export interface PriceSheetBody {
  week: string;
  prices: { exportId: number; price: number | null }[];
}
