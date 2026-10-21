export interface ExportPlanLineBody {
  purchaseOrderLineId: number;
  cuttingDate: string;
  boxQuantity: number;
  bookingContainerIds?: number[];
}

export interface ExportPlanBody {
  purchaseOrderId: number;
  clientId: number;
  departureHarborId: number;
  destinationHarborId: number;
  shippingDateTime?: string;
  shipName?: string;
  estimatedTravelTime?: string;
  bookingNumber?: string;
  numberOfVerifiers?: number;
  shippingCompanyId?: number;
  depositId?: number;
  transportId?: number;
  verifierId?: number;
  bookingId?: number;
  lines: ExportPlanLineBody[];
}

export interface ExportPlanResponse {
  exports: {
    id: number;
    purchaseOrderLineId: number | null;
    boxQuantity: number;
    cuttingDate: string | null;
  }[];
}
