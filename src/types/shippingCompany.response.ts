export interface ShippingCompanyResponse {
  id: number;
  name: string;
  code: string;
  frequencies: string;
  cargoType: string;
  trackingPlatform: string | null;
  country: {
    id: number;
    name: string;
  };
  contacts: {
    id: number;
    name: string;
    role: string | null;
    email: string;
    phone: string;
  }[];
  harbors: {
    harborDeparture: {
      id: number;
      name: string;
    };
    harborDestination: {
      id: number;
      name: string;
    };
    estDuration: string;
    cost: number | null;
  }[];
  createdAt: string;
  updatedAt: string;
  exporterId: number;
}
