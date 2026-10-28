export interface DepositResponse {
  id: number;
  name: string;
  code: string;
  address: string;
  latitude: number | null;
  longitude: number | null;
  openTime: string;
  closeTime: string;
  exporterId: number;
  cityId: number;
  city: {
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
  createdAt: string;
  updatedAt: string;
}
