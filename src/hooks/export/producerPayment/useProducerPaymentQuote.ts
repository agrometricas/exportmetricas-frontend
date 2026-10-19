import {
  PaymentQuoteResult,
  usePaymentQuote,
} from '../../liquidation/usePaymentQuote';

export interface ProducerPaymentQuoteParams {
  merchantId: number;
  boxQuantity: number;
  exportSentId?: number;
  price?: number;
  transport?: number;
  materials?: number;
  others?: number;
}

export interface TransportProposal {
  amount: number;
  containers: number;
  costPerContainer: string;
  transport: string;
  province: string;
}

export interface PriceProposal {
  price: number;
  source: 'PRICE_SHEET' | 'MINIMUM';
  weekStart: string | null;
}

export interface ProducerPaymentQuote {
  price: number;
  priceProposal: PriceProposal;
  transport: number;
  transportProposal: TransportProposal | null;
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
