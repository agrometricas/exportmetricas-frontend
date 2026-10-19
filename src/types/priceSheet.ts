import { PurchaseOrderLineType } from './purchaseOrder';

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
  lineId: number;
  purchaseOrderId: number;
  merchant: { id: number; businessName: string; contractType: string };
  business: Named;
  boxBrand: Named & { brandCode: string };
  type: PurchaseOrderLineType;
  boxQuantity: number;
  price: string | null;
  proposedPrice: string;
  effectivePrice: string;
  total: string;
  belowMinimum: boolean;
  export: { id: number; paidPrice: string | null } | null;
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
  prices: { lineId: number; price: number | null }[];
}
