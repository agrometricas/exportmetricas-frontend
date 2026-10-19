import { ContractUsageCheckParams } from '../../types/contractUsage';
import { INVALID_DAY_DATE } from '../ui/form/InputFieldDayDate';

// The check waits for a farm, a whole cutting day and some boxes.
export function exportQuotaParams(
  values: {
    businessId: number | '' | null;
    cuttingDate: Date | string | '';
    boxQuantity: number | string;
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
  return {
    businessId: Number(values.businessId),
    cuttingDate: new Date(values.cuttingDate).toISOString(),
    boxQuantity: boxes,
    ...(exportId ? { exportId } : {}),
  };
}
