import {
  PaymentQuoteResult,
  usePaymentQuote,
} from '../liquidation/usePaymentQuote';

export interface ClientPaymentQuoteParams {
  boxQuantity: number;
  price?: number;
  exportSentId?: number;
}

export interface SalePriceProposal {
  price: number;
  source: 'CONTRACT' | 'SPOT' | 'DEFAULT';
  purchaseOrderId: number | null;
}

export interface ClientPaymentQuote {
  price: number;
  total: number;
  priceProposal: SalePriceProposal | null;
}

export function useClientPaymentQuote(
  params: ClientPaymentQuoteParams | null
): PaymentQuoteResult<ClientPaymentQuote> {
  return usePaymentQuote('client-payment/quote', params);
}
