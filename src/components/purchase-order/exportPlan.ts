import { ExportPlanBody } from '../../types/exportPlan';
import { PurchaseOrderLine } from '../../types/purchaseOrder';

export interface PlanLineValues {
  purchaseOrderLineId: number;
  include: boolean;
  cuttingDate: string;
  boxQuantity: number | '';
  bookingContainerIds: number[];
}

export interface PlanValues {
  lines: PlanLineValues[];
  clientId: number | '';
  bookingId: number | '';
  shippingCompanyId: number | '';
  departureHarborId: number | '';
  destinationHarborId: number | '';
  shipName: string;
  estimatedTravelTime: string;
  bookingNumber: string;
  shippingDateTime: string;
  depositId: number | '';
  transportId: number | '';
  verifierId: number | '';
  numberOfVerifiers: number | '';
}

export const pendingLines = (lines: PurchaseOrderLine[]): PurchaseOrderLine[] =>
  lines.filter((line) => !line.export);

export function planInitialValues(lines: PurchaseOrderLine[]): PlanValues {
  return {
    lines: pendingLines(lines).map((line) => ({
      purchaseOrderLineId: line.id,
      include: true,
      cuttingDate: '',
      boxQuantity: line.boxQuantity,
      bookingContainerIds: [],
    })),
    clientId: '',
    bookingId: '',
    shippingCompanyId: '',
    departureHarborId: '',
    destinationHarborId: '',
    shipName: '',
    estimatedTravelTime: '',
    bookingNumber: '',
    shippingDateTime: '',
    depositId: '',
    transportId: '',
    verifierId: '',
    numberOfVerifiers: '',
  };
}

const optionalId = (value: number | ''): number | undefined =>
  value ? Number(value) : undefined;
const optionalText = (value: string): string | undefined =>
  value.trim() || undefined;

export function exportPlanBody(
  purchaseOrderId: number,
  values: PlanValues
): ExportPlanBody {
  const withBooking = !!values.bookingId;
  return {
    purchaseOrderId,
    clientId: Number(values.clientId),
    departureHarborId: Number(values.departureHarborId),
    destinationHarborId: Number(values.destinationHarborId),
    shippingDateTime: values.shippingDateTime || undefined,
    shipName: optionalText(values.shipName),
    estimatedTravelTime: optionalText(values.estimatedTravelTime),
    bookingNumber: optionalText(values.bookingNumber),
    numberOfVerifiers: optionalId(values.numberOfVerifiers),
    shippingCompanyId: optionalId(values.shippingCompanyId),
    depositId: optionalId(values.depositId),
    transportId: optionalId(values.transportId),
    verifierId: optionalId(values.verifierId),
    bookingId: optionalId(values.bookingId),
    lines: values.lines
      .filter((line) => line.include)
      .map((line) => ({
        purchaseOrderLineId: line.purchaseOrderLineId,
        cuttingDate: line.cuttingDate,
        boxQuantity: Number(line.boxQuantity),
        ...(withBooking && line.bookingContainerIds.length > 0
          ? { bookingContainerIds: line.bookingContainerIds }
          : {}),
      })),
  };
}
