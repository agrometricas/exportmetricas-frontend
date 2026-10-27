export interface Party {
  id: number;
  name: string;
}

export interface WeekSummaryExport {
  id: number;
  boxQuantity: number;
  cuttingDate: string | null;
  shippingDateTime: string | null;
  merchant: Party;
  business: Party;
  client: Party & { rainforestAlliance: boolean };
  boxBrand: Party & {
    brand: string;
    boxesPerContainer: number;
    grossWeightBox: number;
  };
  destination: {
    region: string | null;
    countryCode: string | null;
    harborCode: string;
  };
  depositCode: string | null;
  shippingCompanyCode: string | null;
  containers: number;
}

export interface WeekDay {
  date: string;
  boxes: number;
  exports: { exportId: number; boxes: number }[];
}

export interface FarmWeek {
  business: Party;
  merchant: Party;
  boxes: number;
  shipments: {
    exportId: number;
    boxes: number;
    boxBrand: string;
    grossWeightBox: number;
  }[];
}

export interface PaymentBoxes {
  boxBrand: Party;
  merchant: Party;
  client: Party;
  clientBoxes: number;
  producerBoxes: number;
}

export type SpotTrend = 'above' | 'below' | 'equal' | null;

export interface SpotWeek {
  reference: { date: string; price: string } | null;
  producers: {
    merchant: Party;
    boxes: number;
    averagePrice: string;
    trend: SpotTrend;
  }[];
}

export interface WeekSummary {
  weekStart: string;
  days: WeekDay[];
  exports: WeekSummaryExport[];
  totals: {
    exports: number;
    boxes: number;
    containers: number;
    producerPaid: string;
    clientCollected: string;
  };
  farms: FarmWeek[];
  payments: PaymentBoxes[];
  spot: SpotWeek;
  filters: { merchants: Party[]; boxBrands: Party[]; clients: Party[] };
}

export interface WeekSummaryFilters {
  merchantId?: number;
  boxBrandId?: number;
  clientId?: number;
}
