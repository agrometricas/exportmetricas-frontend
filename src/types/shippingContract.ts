interface HarborSummary {
  id: number;
  name: string;
  code: string;
}

export interface ShippingContractRoute {
  id: number;
  costPerContainer: string;
  transitDays: number | null;
  harborDeparture: HarborSummary;
  harborDestination: HarborSummary;
}

export interface ShippingContractResponse {
  id: number;
  reference: string | null;
  startDate: string;
  endDate: string;
  active: boolean;
  shippingCompany: { id: number; name: string; code: string };
  routes: ShippingContractRoute[];
}

export interface ShippingContractRouteBody {
  harborDepartureId: number;
  harborDestinationId: number;
  costPerContainer: number;
  transitDays: number | null;
}

export interface ShippingContractBody {
  shippingCompanyId?: number;
  reference: string | null;
  startDate: string;
  endDate: string;
  routes: ShippingContractRouteBody[];
}
