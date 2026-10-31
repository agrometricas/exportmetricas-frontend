interface Named {
  id: number;
  name: string;
}

export interface FarmUsage {
  business: Named;
  merchant: { id: number; businessName: string } | null;
  approvedWeeklyBoxes: number | null;
  exportedBoxes: number;
  contractBoxes: number;
  spotBoxes: number;
  remaining: number | null;
  exceeded: boolean;
  weeklyContainers: number | null;
  contractContainers: number;
  spotContainers: number;
  remainingContainers: number | null;
  price: string | null;
  exports: {
    id: number;
    boxQuantity: number;
    containers: number;
    cuttingDate: string | null;
    contractType: string | null;
  }[];
}

export interface ContractUsage {
  weekStart: string;
  farms: FarmUsage[];
  warnings: string[];
}

export interface ContractUsageCheck {
  weekStart: string;
  business: Named;
  approvedWeeklyBoxes: number | null;
  otherExportedBoxes: number;
  exportedBoxes: number;
  remaining: number | null;
  exceeded: boolean;
  warning: string | null;
  purchase: PurchaseTerms | null;
}

export interface PurchaseTerms {
  contractType: string;
  producerPrice: string | null;
  containers: number;
  contract: {
    weeklyContainers: number | null;
    usedContainers: number;
    price: string;
  } | null;
  note: string | null;
}

export interface ContractUsageCheckParams {
  businessId: number;
  cuttingDate: string;
  boxQuantity: number;
  exportId?: number;
  boxBrandId?: number;
  bookingContainers?: number;
}
