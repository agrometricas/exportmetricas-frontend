import * as Yup from 'yup';
import {
  PurchaseOrderLineType,
  PurchaseOrderResponse,
} from '../../../types/purchaseOrder';
import { startOfLocalDay } from '../../../utils/dayMonthYear';
import { INVALID_DAY_DATE } from '../../ui/form/InputFieldDayDate';

export interface LineValues {
  id?: number;
  businessId: number | '';
  boxBrandId: number | '';
  boxQuantity: string;
  type: PurchaseOrderLineType;
}

export interface ValuesProps {
  merchantId: number | '';
  weekDay: string;
  notes: string;
  lines: LineValues[];
}

export const emptyLine: LineValues = {
  businessId: '',
  boxBrandId: '',
  boxQuantity: '',
  type: 'CONTRACT',
};

export const initialValues: ValuesProps = {
  merchantId: '',
  weekDay: '',
  notes: '',
  lines: [emptyLine],
};

export function valuesFromOrder(order: PurchaseOrderResponse): ValuesProps {
  return {
    merchantId: order.merchant.id,
    weekDay: startOfLocalDay(order.weekStart),
    notes: order.notes ?? '',
    lines: order.lines.map((line) => ({
      id: line.id,
      businessId: line.business.id,
      boxBrandId: line.boxBrand.id,
      boxQuantity: String(line.boxQuantity),
      type: line.type,
    })),
  };
}

export const LINE_TYPES: { id: PurchaseOrderLineType; name: string }[] = [
  { id: 'CONTRACT', name: 'Contrato' },
  { id: 'SPOT', name: 'Spot' },
];

export const isCompleteDay = (value: string): boolean =>
  Boolean(value) && value !== INVALID_DAY_DATE;

export const validationSchema = Yup.object({
  merchantId: Yup.number()
    .typeError('Selecciona el productor')
    .required('Selecciona el productor'),
  weekDay: Yup.string()
    .required('Requerido')
    .test(
      'fecha',
      'Fecha inválida, use DD/MM/AAAA',
      (value) => !value || value !== INVALID_DAY_DATE
    ),
  notes: Yup.string().max(500, 'Máximo 500 caracteres'),
  lines: Yup.array()
    .of(
      Yup.object({
        businessId: Yup.number()
          .typeError('Selecciona la finca')
          .required('Selecciona la finca'),
        boxBrandId: Yup.number()
          .typeError('Selecciona la alícuota')
          .required('Selecciona la alícuota'),
        boxQuantity: Yup.string()
          .required('Requerido')
          .matches(/^\d+$/, 'Debe ser un número entero')
          .test('rango', 'Entre 1 y 100000 cajas', (value) => {
            const boxes = Number(value);
            return boxes >= 1 && boxes <= 100000;
          }),
        type: Yup.string().oneOf(['CONTRACT', 'SPOT']).required(),
      })
    )
    .min(1, 'La orden necesita al menos una línea'),
});
