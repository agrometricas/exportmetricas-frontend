import { LineValues, ValuesProps } from './schemas/purchaseOrder.schema';
import {
  PurchaseOrderBody,
  PurchaseOrderLineBody,
} from '../../types/purchaseOrder';

const lineBody = (line: LineValues): PurchaseOrderLineBody => ({
  ...(line.id ? { id: line.id } : {}),
  boxBrandId: Number(line.boxBrandId),
  boxQuantity: Number(line.boxQuantity),
  price: line.price ? Number(line.price) : null,
});

// The type and the client of an order do not change once it is saved, and the
// backend rejects them on an edit. A spot order is for one week: it carries no
// end.
export function purchaseOrderBody(
  values: ValuesProps,
  { editing }: { editing: boolean }
): PurchaseOrderBody {
  return {
    ...(editing
      ? {}
      : { type: values.type, clientId: Number(values.clientId) }),
    startWeek: values.startDay,
    endWeek: values.type === 'CONTRACT' && values.endDay ? values.endDay : null,
    notes: values.notes.trim() || null,
    lines: values.lines.map(lineBody),
  };
}
