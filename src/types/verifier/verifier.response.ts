export interface VerifierContact {
  id: number;
  name: string;
  email: string;
  phone: string;
  exporterId: number;
}

export interface VerifierResponse {
  id: number;
  name: string;
  ruc: string;
  address: string;
  exporterId: number;
  contacts: VerifierContact[];
}
