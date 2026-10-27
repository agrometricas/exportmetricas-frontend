import { BankAccountType } from './bankAccount';
import { HarborType } from './harbor';
import { MerchantType } from './merchant/merchant';

export type ProducerPaymentType = {
  id: number | '';
  exportSentId: number | '';
  // selling
  merchantId: number | '';
  merchant: Partial<MerchantType>;
  departureHarborId: number | '';
  harborDeparture: Partial<HarborType>;
  destinationHarborId: number | '';
  harborDestination: Partial<HarborType>;
  boxQuantity: number | '';
  boxBrandId: number | '';
  subtotal1: number | '';
  price: number | '';
  // expenses
  transport: number | '';
  materials: number | '';
  others: number | '';
  description: string;
  subtotal2: number | '';
  total: number | '';

  sourceBankAccount: Partial<BankAccountType>;
  sourceBankAccountId: number | '';
  destinationBankAccount: Partial<BankAccountType>;
  destinationBankAccountId: number | '';
  amount: number | '';
};

export interface ProducerPaymentListItem {
  id: number;
  merchant: {
    businessName: string;
    businessId: string;
    contractType: string;
    email: string;
  };
  harborDeparture: {
    name: string;
    country: { name: string };
    city: { name: string };
  };
  harborDestination: {
    name: string;
    country: { name: string };
    city: { name: string };
  };
  boxBrand: {
    name: string;
    brandCode: string;
    netWeightBox: number;
    grossWeightBox: number;
    requiredCertificates?: { id: number; name: string }[];
  };
  boxQuantity: number;
  price: string;
  subtotal1: string;
  transport: string;
  materials: string;
  others: string;
  subtotal2: string;
  total: string;
  amount: string;
  transferUrl: string;
  description?: string;
  sourceBankAccount?: {
    owner: string;
    ownerID: string;
    accountNumber: string;
    type: string;
    email: string;
  };
  destinationBankAccount?: {
    owner: string;
    ownerID: string;
    accountNumber: string;
    type: string;
    email: string;
  };
}
