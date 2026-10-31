import * as Yup from 'yup';
import {
  PurchaseOrderResponse,
  PurchaseOrderType,
} from '../../../types/purchaseOrder';
import { startOfLocalDay } from '../../../utils/dayMonthYear';
import { INVALID_DAY_DATE } from '../../ui/form/InputFieldDayDate';

export interface LineValues {
  id?: number;
  boxBrandId: number | '';
  boxQuantity: string;
  price: string;
}

export interface ValuesProps {
  type: PurchaseOrderType;
  clientId: number | '';
  startDay: string;
  endDay: string;
  notes: string;
  lines: LineValues[];
}

export const emptyLine: LineValues = {
  boxBrandId: '',
  boxQuantity: '',
  price: '',
};

export const initialValues: ValuesProps = {
  type: 'CONTRACT',
  clientId: '',
  startDay: '',
  endDay: '',
  notes: '',
  lines: [emptyLine],
};

export function valuesFromOrder(order: PurchaseOrderResponse): ValuesProps {
  return {
    type: order.type,
    clientId: order.client.id,
    startDay: startOfLocalDay(order.startWeek),
    endDay:
      order.type === 'CONTRACT' && order.endWeek
        ? startOfLocalDay(order.endWeek)
        : '',
    notes: order.notes ?? '',
    lines: order.lines.map((line) => ({
      id: line.id,
      boxBrandId: line.boxBrand.id,
      boxQuantity: String(line.boxQuantity),
      price: line.price ? Number(line.price).toFixed(2) : '',
    })),
  };
}

export const ORDER_TYPES: { id: PurchaseOrderType; name: string }[] = [
  { id: 'CONTRACT', name: 'Contrato: se repite cada semana' },
  { id: 'SPOT', name: 'Spot: solo una semana' },
];

export const isCompleteDay = (value: string): boolean =>
  Boolean(value) && value !== INVALID_DAY_DATE;

const validDay = (value?: string): boolean =>
  !value || value !== INVALID_DAY_DATE;

export const validationSchema = Yup.object({
  type: Yup.string().oneOf(['CONTRACT', 'SPOT']).required(),
  clientId: Yup.number()
    .typeError('Selecciona el cliente')
    .required('Selecciona el cliente'),
  startDay: Yup.string()
    .required('Requerido')
    .test('fecha', 'Fecha inválida, use DD/MM/AAAA', validDay),
  endDay: Yup.string()
    .test('fecha', 'Fecha inválida, use DD/MM/AAAA', validDay)
    .test(
      'despues-del-inicio',
      'La semana de fin no puede ser anterior a la de inicio',
      function (value) {
        const { startDay } = this.parent as ValuesProps;
        if (!value || !isCompleteDay(value) || !isCompleteDay(startDay))
          return true;
        return new Date(value).getTime() >= new Date(startDay).getTime();
      }
    ),
  notes: Yup.string().max(500, 'Máximo 500 caracteres'),
  lines: Yup.array()
    .of(
      Yup.object({
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
        price: Yup.string()
          .matches(/^\d+(\.\d{1,2})?$/, {
            message: 'Un número con hasta dos decimales',
            excludeEmptyString: true,
          })
          .test(
            'rango',
            'Mayor que 0 y hasta 1000',
            (value) => !value || (Number(value) > 0 && Number(value) <= 1000)
          ),
      })
    )
    .min(1, 'La orden necesita al menos una alícuota')
    .test('sin-repetir', 'Cada alícuota va una sola vez', (lines) => {
      const ids = (lines ?? [])
        .map((line) => line.boxBrandId)
        .filter((id) => id !== undefined && id !== null);
      return new Set(ids).size === ids.length;
    }),
});
