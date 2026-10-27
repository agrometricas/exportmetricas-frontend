export type ContactType = {
  name: string;
  email: string;
  phone: string;
};

export type TransportType = {
  name: string;
  ruc: string;
  address: string;
  satelliteTracking: boolean;
  contacts: Partial<ContactType>[];
  certifications: number[];
};
