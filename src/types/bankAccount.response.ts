export interface City {
  id: number;
  name: string;
  code?: string;
  provinceId: number;
}

export interface Merchant {
  id: number;
  businessName: string;
  businessId: string;
  city: City;
  address: string;
  email: string;
}

export interface Client {
  id: number;
  businessName: string;
  businessId: string;
  commercialType: string;
  city: City | null;
  address: string;
  email: string;
  phone: string;
}

export interface BankAccountResponse {
  id: number;
  merchant: Merchant | null;
  client: Client | null;
  bank: string;
  owner: string;
  ownerID: string;
  accountNumber: string;
  type: string;
  email: string;
}
