export type HarborInfo = {
  harborId: number | '';
  estDuration: string;
};

export type ContactType = {
  name: string;
  email: string;
  phone: string;
};

export type ShippingCompanyType = {
  id: number;
  name: string;
  code: string;
  countryId: number | '';
  frequencies: string;
  cargoType: string;
  trackingPlatform: string;
  harbors: Array<{
    harborDeparture: { id: number | ''; name: string };
    harborDestination: { id: number | ''; name: string };
    estDuration: string;
    cost: number | null;
  }>;
  contacts: Partial<ContactType>[];
};
