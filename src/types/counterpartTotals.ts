interface Counts {
  id: number;
  name: string;
  exports: number;
  boxes: number;
  containers: number;
}

export interface ClientTotals extends Counts {
  collected: string;
  collectedExports: number;
  producerPaid: string;
  freight: string;
}

export interface ProducerTotals extends Counts {
  paid: string;
  paidExports: number;
}

export interface CarrierTotals extends Counts {
  freight: string;
  exportsWithFreight: number;
}

export interface CounterpartReport {
  from: string;
  to: string;
  totals: { exports: number; boxes: number; containers: number };
  clients: ClientTotals[];
  producers: ProducerTotals[];
  departureHarbors: Counts[];
  destinationHarbors: Counts[];
  shippingCompanies: CarrierTotals[];
  deposits: Counts[];
  verifiers: Counts[];
}

export type CounterpartCounts = Counts;
