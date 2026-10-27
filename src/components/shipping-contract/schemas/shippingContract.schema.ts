import * as Yup from 'yup';
import { ShippingContractResponse } from '../../../types/shippingContract';
import { INVALID_DAY_DATE } from '../../ui/form/InputFieldDayDate';

export interface RouteValues {
  harborDepartureId: number | '';
  harborDestinationId: number | '';
  costPerContainer: string;
  transitDays: string;
}

export interface ValuesProps {
  shippingCompanyId: number | '';
  reference: string;
  startDate: string;
  endDate: string;
  routes: RouteValues[];
}

export const emptyRoute: RouteValues = {
  harborDepartureId: '',
  harborDestinationId: '',
  costPerContainer: '',
  transitDays: '',
};

export const initialValues: ValuesProps = {
  shippingCompanyId: '',
  reference: '',
  startDate: '',
  endDate: '',
  routes: [emptyRoute],
};

export function valuesFromContract(
  contract: ShippingContractResponse
): ValuesProps {
  return {
    shippingCompanyId: contract.shippingCompany.id,
    reference: contract.reference ?? '',
    startDate: contract.startDate,
    endDate: contract.endDate,
    routes: contract.routes.map((route) => ({
      harborDepartureId: route.harborDeparture.id,
      harborDestinationId: route.harborDestination.id,
      costPerContainer: Number(route.costPerContainer).toFixed(2),
      transitDays: route.transitDays ? String(route.transitDays) : '',
    })),
  };
}

const MONEY = /^\d+([.,]\d{1,2})?$/;
const WHOLE = /^\d*$/;

export const toAmount = (text: string): number =>
  Number(text.trim().replace(',', '.'));

const validDate = (value?: string): boolean =>
  !value || value !== INVALID_DAY_DATE;

const harbor = (message: string): Yup.NumberSchema =>
  Yup.number().typeError(message).required(message);

export const validationSchema = Yup.object({
  shippingCompanyId: harbor('Selecciona la naviera'),
  reference: Yup.string().max(60, 'Máximo 60 caracteres'),
  startDate: Yup.string()
    .required('Requerido')
    .test('fecha', 'Fecha inválida, use DD/MM/AAAA', validDate),
  endDate: Yup.string()
    .required('Requerido')
    .test('fecha', 'Fecha inválida, use DD/MM/AAAA', validDate)
    .test(
      'despues-del-inicio',
      'La fecha de fin no puede ser anterior a la de inicio',
      function (value) {
        const { startDate } = this.parent as ValuesProps;
        if (!value || !startDate || !validDate(value) || !validDate(startDate))
          return true;
        return new Date(value).getTime() >= new Date(startDate).getTime();
      }
    ),
  routes: Yup.array()
    .of(
      Yup.object({
        harborDepartureId: harbor('Selecciona el puerto de salida'),
        harborDestinationId: harbor('Selecciona el puerto de destino'),
        costPerContainer: Yup.string()
          .required('Requerido')
          .matches(MONEY, 'Monto inválido, máximo dos decimales')
          .test(
            'positivo',
            'Debe ser mayor que 0',
            (v) => !v || toAmount(v) > 0
          ),
        transitDays: Yup.string()
          .matches(WHOLE, 'Debe ser un número entero de días')
          .test('positivo', 'Debe ser mayor que 0', (v) => !v || Number(v) > 0),
      })
    )
    .min(1, 'Agrega al menos una ruta'),
});
