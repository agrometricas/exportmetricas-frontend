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
