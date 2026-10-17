interface HarborSummary {
  id: number;
  name: string;
  code: string;
}

export interface BookingResponse {
  id: number;
  bookingNumber: string;
  shipName: string;
  etd: string;
  eta: string | null;
  containerCount: number;
  costPerContainer: string;
  transitDays: number | null;
  estimatedFreight: string;
  shippingCompany: { id: number; name: string; code: string };
  shippingContract: { id: number; reference: string | null };
  harborDeparture: HarborSummary;
  harborDestination: HarborSummary;
  containers: { id: number; number: string }[];
}

export interface BookingBody {
  bookingNumber: string;
  shippingCompanyId: number;
  harborDepartureId: number;
  harborDestinationId: number;
  shipName: string;
  etd: string;
  containerCount: number;
  containers: string[];
}

export interface RouteInForce {
  id: number;
  costPerContainer: string;
  transitDays: number | null;
  harborDeparture: HarborSummary;
  harborDestination: HarborSummary;
  contract: { id: number; reference: string | null; endDate: string };
}
