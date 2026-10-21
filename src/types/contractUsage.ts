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
  unplannedBoxes: number;
  remaining: number | null;
  exceeded: boolean;
  exports: { id: number; boxQuantity: number; cuttingDate: string | null }[];
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
}

export interface ContractUsageCheckParams {
  businessId: number;
  cuttingDate: string;
  boxQuantity: number;
  exportId?: number;
}
