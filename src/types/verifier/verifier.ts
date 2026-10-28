export type ContactType = {
  name: string;
  email: string;
  phone: string;
};

export type VerifierType = {
  name: string;
  ruc: string;
  address: string;
  contacts: Partial<ContactType>[];
};
