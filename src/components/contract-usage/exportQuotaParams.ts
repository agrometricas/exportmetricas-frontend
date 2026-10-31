import { ContractUsageCheckParams } from '../../types/contractUsage';
import { INVALID_DAY_DATE } from '../ui/form/InputFieldDayDate';

// The check waits for a farm, a whole cutting day and some boxes. With the box
// brand it also says whether the export would be bought under contract or spot.
export function exportQuotaParams(
  values: {
    businessId: number | '' | null;
    cuttingDate: Date | string | '';
    boxQuantity: number | string;
    boxBrandId?: number | '' | null;
    bookingId?: number | '' | null;
    bookingContainerIds?: number[];
  },
  exportId?: number
): ContractUsageCheckParams | null {
  const boxes = Number(values.boxQuantity);
  if (
    !values.businessId ||
    !values.cuttingDate ||
    values.cuttingDate === INVALID_DAY_DATE ||
    !Number.isInteger(boxes) ||
    boxes <= 0
  ) {
    return null;
  }
  const containers = values.bookingId
    ? (values.bookingContainerIds ?? []).length
    : 0;
  return {
    businessId: Number(values.businessId),
    cuttingDate: new Date(values.cuttingDate).toISOString(),
    boxQuantity: boxes,
    ...(exportId ? { exportId } : {}),
    ...(values.boxBrandId ? { boxBrandId: Number(values.boxBrandId) } : {}),
    ...(containers > 0 ? { bookingContainers: containers } : {}),
  };
}
