import * as Yup from 'yup';
import { BookingResponse } from '../../../types/booking';
import {
  formatHourMinute,
  isHourMinute,
  startOfLocalDay,
} from '../../../utils/dayMonthYear';
import { INVALID_DAY_DATE } from '../../ui/form/InputFieldDayDate';

export interface ValuesProps {
  bookingNumber: string;
  shippingCompanyId: number | '';
  harborDepartureId: number | '';
  harborDestinationId: number | '';
  shipName: string;
  etdDay: string;
  etdTime: string;
  containerCount: string;
  containers: string[];
}

export const initialValues: ValuesProps = {
  bookingNumber: '',
  shippingCompanyId: '',
  harborDepartureId: '',
  harborDestinationId: '',
  shipName: '',
  etdDay: '',
  etdTime: '',
  containerCount: '',
  containers: [],
};

export function valuesFromBooking(booking: BookingResponse): ValuesProps {
  return {
    bookingNumber: booking.bookingNumber,
    shippingCompanyId: booking.shippingCompany.id,
    harborDepartureId: booking.harborDeparture.id,
    harborDestinationId: booking.harborDestination.id,
    shipName: booking.shipName,
    etdDay: startOfLocalDay(booking.etd),
    etdTime: formatHourMinute(booking.etd),
    containerCount: String(booking.containerCount),
    containers: booking.containers.map((container) => container.number),
  };
}

export const normalizeContainer = (text: string): string =>
  text.replace(/[\s-]/g, '').toUpperCase();

const CONTAINER_NUMBER = /^[A-Z]{4}\d{7}$/;

export const validationSchema = Yup.object({
  bookingNumber: Yup.string()
    .trim()
    .required('Requerido')
    .max(40, 'Máximo 40 caracteres'),
  shippingCompanyId: Yup.number()
    .typeError('Seleccione la naviera')
    .required('Seleccione la naviera'),
  harborDepartureId: Yup.number()
    .typeError('Seleccione la ruta')
    .required('Seleccione la ruta'),
  shipName: Yup.string()
    .trim()
    .required('Requerido')
    .max(100, 'Máximo 100 caracteres'),
  etdDay: Yup.string()
    .required('Requerido')
    .test(
      'fecha',
      'Fecha inválida, use DD/MM/AAAA',
      (value) => !value || value !== INVALID_DAY_DATE
    ),
  etdTime: Yup.string()
    .required('Requerido')
    .test('hora', 'Hora inválida, use HH:mm (24 horas)', (value) =>
      isHourMinute(value ?? '')
    ),
  containerCount: Yup.string()
    .required('Requerido')
    .matches(/^\d+$/, 'Debe ser un número entero')
    .test('rango', 'Entre 1 y 500 contenedores', (value) => {
      const count = Number(value);
      return count >= 1 && count <= 500;
    }),
  containers: Yup.array()
    .of(
      Yup.string().test(
        'formato',
        'Cuatro letras y siete dígitos, como MSKU1234567',
        (value) => !value || CONTAINER_NUMBER.test(normalizeContainer(value))
      )
    )
    .test(
      'no-mas-que-reservados',
      'Hay más números que contenedores reservados',
      function (value) {
        const count = Number((this.parent as ValuesProps).containerCount);
        const filled = (value ?? []).filter((n) => n && n.trim()).length;
        return !count || filled <= count;
      }
    ),
});
