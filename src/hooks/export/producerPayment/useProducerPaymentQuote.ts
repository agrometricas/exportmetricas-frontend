import {
  PaymentQuoteResult,
  usePaymentQuote,
} from '../../liquidation/usePaymentQuote';

export interface ProducerPaymentQuoteParams {
  merchantId: number;
  boxQuantity: number;
  price?: number;
  transport?: number;
  materials?: number;
  others?: number;
}

export interface ProducerPaymentQuote {
  price: number;
  subtotal1: number;
  subtotal2: number;
  total: number;
  amount: number;
}

export function useProducerPaymentQuote(
  params: ProducerPaymentQuoteParams | null
): PaymentQuoteResult<ProducerPaymentQuote> {
  return usePaymentQuote('export/producer-payment/quote', params);
}
