import {
  PaymentQuoteResult,
  usePaymentQuote,
} from '../liquidation/usePaymentQuote';

export interface ClientPaymentQuoteParams {
  boxQuantity: number;
  price?: number;
}

export interface ClientPaymentQuote {
  price: number;
  total: number;
}

export function useClientPaymentQuote(
  params: ClientPaymentQuoteParams | null
): PaymentQuoteResult<ClientPaymentQuote> {
  return usePaymentQuote('client-payment/quote', params);
}
