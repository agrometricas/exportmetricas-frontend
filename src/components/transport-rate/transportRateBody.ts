import * as Yup from 'yup';
import { TransportRateBody } from '../../types/transportRate';

export interface ValuesProps {
  transportId: number | '';
  provinceId: number | '';
  costPerContainer: string;
}

export const initialValues: ValuesProps = {
  transportId: '',
  provinceId: '',
  costPerContainer: '',
};

const MONEY = /^\d+([.,]\d{1,2})?$/;

const toAmount = (text: string): number =>
  Number(text.trim().replace(',', '.'));

export const validationSchema = Yup.object({
  transportId: Yup.number()
    .typeError('Selecciona el transportista')
    .required('Selecciona el transportista'),
  provinceId: Yup.number()
    .typeError('Selecciona la provincia')
    .required('Selecciona la provincia'),
  costPerContainer: Yup.string()
    .required('Requerido')
    .matches(MONEY, 'Monto inválido, máximo dos decimales')
    .test('positivo', 'Debe ser mayor que 0', (v) => !v || toAmount(v) > 0),
});

// Editing a rate only changes its cost: the carrier and the province identify
// it, and the backend rejects any other field.
export function transportRateBody(
  values: ValuesProps,
  { editing }: { editing: boolean }
): TransportRateBody {
  return {
    ...(editing
      ? {}
      : {
          transportId: Number(values.transportId),
          provinceId: Number(values.provinceId),
        }),
    costPerContainer: toAmount(values.costPerContainer),
  };
}
