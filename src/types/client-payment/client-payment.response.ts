export interface ClientPayment {
  id: number;
  createdAt: string;
  updatedAt: string;
  clientId: number;
  exportSentId: number;
  boxBrandId: number;
  boxQuantity: number;
  price: string;
  total: string;
  description?: string;
  transferKey?: string;
  transferUrl?: string;
  client: {
    id: number;
    businessName: string;
    businessId: string;
    email: string;
    type: string;
  };
  exportSent: Record<string, unknown>;
  boxBrand: {
    id: number;
    name: string;
    brandCode: string;
    netWeightBox: number;
    grossWeightBox: number;
  };
  sourceBankAccount?: {
    id: number;
    bank: string;
    owner: string;
    ownerID: string;
    accountNumber: string;
    type: string;
    email: string;
  };
  destinationBankAccount?: {
    id: number;
    bank: string;
    owner: string;
    ownerID: string;
    accountNumber: string;
    type: string;
    email: string;
  };
}
