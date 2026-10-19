type Place = { id: number; name: string } | null;

export interface BusinessDetail {
  id: number;
  name: string;
  merchant: { id: number; businessName: string } | null;
  country: Place;
  province: Place;
  city: Place;
  address: string | null;
  fruitType: string;
  area: number;
  latitude: number | null;
  longitude: number | null;
  codeMAGAP: string;
  codeAGROCALIDAD: string;
  certificates: { certificate: { id: number; name: string } }[];
  businessCodes: { id: number; code: string }[];
  contacts: {
    id: number;
    name: string;
    email: string | null;
    role: string | null;
    phone: string;
  }[];
}

export interface BusinessUpdateBody {
  name: string;
  area: number;
  fruitType: string;
  codeMAGAP: string;
  codeAGROCALIDAD: string;
  countryId: number | null;
  provinceId: number | null;
  cityId: number | null;
  address: string;
  latitude: number | null;
  longitude: number | null;
  certificates: number[];
  businessCodes?: { id?: number; code: string }[];
  contacts?: {
    id?: number;
    name: string;
    role: string | null;
    email: string | null;
    phone: string;
  }[];
}
