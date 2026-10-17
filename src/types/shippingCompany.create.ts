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
  departureHarbors: Array<HarborInfo>;
  destinationHarbors: Array<HarborInfo>;
  contacts: Partial<ContactType>[];
};
