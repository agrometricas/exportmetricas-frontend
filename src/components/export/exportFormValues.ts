import { ValuesProps } from './schemas/export.schema';
import { ExportResponse } from '../../types/export.response';

const WEEK_DAYS = 7;

function weekOf<T>(values: T[] | null | undefined, empty: T): T[] {
  return Array.from({ length: WEEK_DAYS }, (_, i) => values?.[i] ?? empty);
}

// A duplicate travels on the same booking but not in the same containers:
// those are already loaded by the original export.
export function exportFormValues(
  source: ExportResponse,
  { withContainers = true }: { withContainers?: boolean } = {}
): ValuesProps {
  return {
    boxQuantity: source.boxQuantity,
    boxBrandId: source.boxBrand.id,
    merchantId: source.merchant.id,
    businessId: source.business.id,
    clientId: source.client.id,
    cuttingDate: source.cuttingDate ? new Date(source.cuttingDate) : '',
    shippingDateTime: source.shippingDateTime
      ? new Date(source.shippingDateTime)
      : '',
    weekCutting: {
      description: source.weekDescription ?? '',
      daysOfWeek: weekOf(source.weekDaysOfWeek, ''),
      boxesOfDay: weekOf(source.weekBoxesOfDay, 0),
      total: source.weekTotal ?? source.boxQuantity,
    },
    shipName: source.shipName ?? '',
    estimatedTravelTime: source.estimatedTravelTime ?? '',
    bookingNumber: source.bookingNumber ?? '',
    contractType: source.contractType ?? '',
    numberOfVerifiers: source.numberOfVerifiers ?? 0,
    shippingCompanyId: source.shippingCompany?.id ?? 0,
    departureHarborId: source.harborDeparture.id,
    destinationHarborId: source.harborDestination.id,
    depositId: source.deposit?.id ?? 0,
    transportId: source.transport?.id ?? 0,
    verifierId: source.verifier?.id ?? 0,
    bookingId: source.booking?.id ?? '',
    bookingContainerIds: withContainers
      ? (source.containers ?? []).map((container) => container.id)
      : [],
    dataReviewed: false,
  };
}
