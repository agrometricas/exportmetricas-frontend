import { ContactType } from './merchant/contact';

export interface ClientResponse {
  id: number;
  businessName: string;
  businessId: string;
  type: string;
  address: string;
  postalCode: string;
  website: string;
  commercialType: string;
  purchaseVolumeLabel: string | null;
  paymentTermLabel: string | null;
  shippingMethod: string;
  email: string;
  phone: string;
  country: {
    id: number;
    name: string;
  };
  countryId: number;
  province: {
    id: number;
    name: string;
  };
  provinceId: number;
  city: {
    id: number;
    name: string;
  };
  cityId: number;
  harbors: {
    id: number;
    name: string;
  }[];
  incoterms: {
    id: number;
    name: string;
  }[];
  certificates: {
    certificate: {
      id: number;
      name: string;
    };
  }[];
  contacts: ContactType[];
  createdAt: string;
  updatedAt: string;
  exporterId: number;
}
