import { ExportPlanBody } from '../../types/exportPlan';

export interface PlanLineValues {
  businessId: number | '';
  boxBrandId: number | '';
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

export const planLine = (boxBrandId: number | ''): PlanLineValues => ({
  businessId: '',
  boxBrandId,
  cuttingDate: '',
  boxQuantity: '',
  bookingContainerIds: [],
});

// What the client still has to get starts the first farm's boxes: the user
// splits it among farms from there.
export function planInitialValues({
  clientId,
  boxBrandId,
  pendingBoxes,
}: {
  clientId: number | '';
  boxBrandId: number | '';
  pendingBoxes?: number;
}): PlanValues {
  return {
    lines: [
      {
        ...planLine(boxBrandId),
        boxQuantity: pendingBoxes && pendingBoxes > 0 ? pendingBoxes : '',
      },
    ],
    clientId,
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

export function exportPlanBody(values: PlanValues): ExportPlanBody {
  const withBooking = !!values.bookingId;
  return {
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
    lines: values.lines.map((line) => ({
      businessId: Number(line.businessId),
      boxBrandId: Number(line.boxBrandId),
      cuttingDate: line.cuttingDate,
      boxQuantity: Number(line.boxQuantity),
      ...(withBooking && line.bookingContainerIds.length > 0
        ? { bookingContainerIds: line.bookingContainerIds }
        : {}),
    })),
  };
}
