export type PurchaseOrderType = 'CONTRACT' | 'SPOT';

interface Named {
  id: number;
  name: string;
}

export interface OrderBoxBrand extends Named {
  brandCode: string;
  boxQuantity: number;
}

export interface PurchaseOrderLine {
  id: number;
  boxQuantity: number;
  price: string | null;
  containers: number;
  boxBrand: OrderBoxBrand;
}

export interface PurchaseOrderSummary {
  id: number;
  type: PurchaseOrderType;
  startWeek: string;
  endWeek: string | null;
  notes: string | null;
  client: { id: number; businessName: string };
  weeklyBoxes: number;
  inForce: boolean;
  lineCount: number;
}

export interface PurchaseOrderResponse
  extends Omit<PurchaseOrderSummary, 'lineCount'> {
  lines: PurchaseOrderLine[];
}

export interface PurchaseOrderLineBody {
  id?: number;
  boxBrandId: number;
  boxQuantity: number;
  price: number | null;
}

export interface PurchaseOrderBody {
  type?: PurchaseOrderType;
  clientId?: number;
  startWeek: string;
  endWeek: string | null;
  notes: string | null;
  lines: PurchaseOrderLineBody[];
}

export interface DemandRow {
  client: { id: number; businessName: string };
  boxBrand: OrderBoxBrand;
  contractBoxes: number;
  spotBoxes: number;
  requestedBoxes: number;
  assignedBoxes: number;
  pendingBoxes: number;
  excessBoxes: number;
  orders: {
    id: number;
    type: PurchaseOrderType;
    boxQuantity: number;
    price: string | null;
  }[];
  exports: {
    id: number;
    business: Named;
    merchant: { id: number; businessName: string };
    boxQuantity: number;
    cuttingDate: string | null;
    contractType: string | null;
  }[];
}

export interface WeekDemand {
  weekStart: string;
  rows: DemandRow[];
  totals: {
    requestedBoxes: number;
    assignedBoxes: number;
    pendingBoxes: number;
  };
  warnings: string[];
}
