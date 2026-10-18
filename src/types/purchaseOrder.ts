export type PurchaseOrderLineType = 'CONTRACT' | 'SPOT';

interface Named {
  id: number;
  name: string;
}

export interface PurchaseOrderLine {
  id: number;
  type: PurchaseOrderLineType;
  boxQuantity: number;
  business: Named;
  boxBrand: Named & { brandCode: string };
  export: {
    id: number;
    boxQuantity: number;
    cuttingDate: string | null;
  } | null;
}

export interface BusinessQuota {
  business: Named;
  approvedWeeklyBoxes: number | null;
  contractBoxes: number;
  spotBoxes: number;
  remaining: number | null;
  warnings: string[];
}

export interface OrderTotals {
  contractBoxes: number;
  spotBoxes: number;
  boxes: number;
}

export interface OrderQuota {
  totals: OrderTotals;
  quota: BusinessQuota[];
  warnings: string[];
}

export interface PurchaseOrderResponse extends OrderQuota {
  id: number;
  weekStart: string;
  notes: string | null;
  merchant: { id: number; businessName: string };
  lines: PurchaseOrderLine[];
}

export interface PurchaseOrderSummary {
  id: number;
  weekStart: string;
  notes: string | null;
  merchant: { id: number; businessName: string };
  totals: OrderTotals;
  lineCount: number;
  exportedLines: number;
}

export interface PurchaseOrderLineBody {
  id?: number;
  businessId: number;
  boxBrandId: number;
  boxQuantity: number;
  type: PurchaseOrderLineType;
}

export interface PurchaseOrderBody {
  merchantId?: number;
  weekStart: string;
  notes: string | null;
  lines: PurchaseOrderLineBody[];
}

export interface PurchaseOrderQuoteBody {
  merchantId: number;
  weekStart: string;
  lines: PurchaseOrderLineBody[];
}
