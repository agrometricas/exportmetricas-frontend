export type ContactType = {
  name: string;
  email: string;
  phone: string;
};

export type DepositType = {
  name: string;
  code: string;
  countryId: number | '';
  provinceId: number | '';
  cityId: number | '';
  address: string;
  latitude: number;
  longitude: number;
  openTime: string;
  closeTime: string;
  contacts: Partial<ContactType>[];
};
