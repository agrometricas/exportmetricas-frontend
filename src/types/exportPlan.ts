export interface ExportPlanLineBody {
  businessId: number;
  boxBrandId: number;
  cuttingDate: string;
  boxQuantity: number;
  bookingContainerIds?: number[];
}

export interface ExportPlanBody {
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
    businessId: number;
    boxBrandId: number;
    boxQuantity: number;
    cuttingDate: string | null;
    contractType: string | null;
    producerPrice: string | null;
    note: string | null;
  }[];
}
