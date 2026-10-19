import {
  isCompleteDay,
  LineValues,
  ValuesProps,
} from './schemas/purchaseOrder.schema';
import {
  PurchaseOrderBody,
  PurchaseOrderLineBody,
  PurchaseOrderQuoteBody,
} from '../../types/purchaseOrder';

const lineBody = (line: LineValues): PurchaseOrderLineBody => ({
  ...(line.id ? { id: line.id } : {}),
  businessId: Number(line.businessId),
  boxBrandId: Number(line.boxBrandId),
  boxQuantity: Number(line.boxQuantity),
  type: line.type,
});

// The producer of an order does not change once it is saved, and the backend
// rejects the field on an edit.
export function purchaseOrderBody(
  values: ValuesProps,
  { editing }: { editing: boolean }
): PurchaseOrderBody {
  return {
    ...(editing ? {} : { merchantId: Number(values.merchantId) }),
    weekStart: values.weekDay,
    notes: values.notes.trim() || null,
    lines: values.lines.map(lineBody),
  };
}

const isCompleteLine = (line: LineValues): boolean =>
  Boolean(line.businessId) &&
  Boolean(line.boxBrandId) &&
  /^\d+$/.test(line.boxQuantity) &&
  Number(line.boxQuantity) >= 1;

// The quota is asked for as soon as there is a producer and a week, with the
// lines that are already complete: a half-filled row would be rejected.
export function purchaseOrderQuoteBody(
  values: ValuesProps
): PurchaseOrderQuoteBody | null {
  if (!values.merchantId || !isCompleteDay(values.weekDay)) return null;
  return {
    merchantId: Number(values.merchantId),
    weekStart: values.weekDay,
    lines: values.lines
      .filter(isCompleteLine)
      .map((line) => lineBody({ ...line, id: undefined })),
  };
}
