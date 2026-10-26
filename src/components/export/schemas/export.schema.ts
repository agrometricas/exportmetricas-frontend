import * as Yup from 'yup';
interface WeekCuttingProps {
  description: string;
  daysOfWeek: string[];
  boxesOfDay: number[];
  total: number;
}

export interface ValuesProps {
  boxQuantity: number;
  boxBrandId: number;
  merchantId: number;
  businessId: number;
  clientId: number;
  weekCutting: WeekCuttingProps;
  cuttingDate: Date | '';
  shippingDateTime: Date | '';
  shipName: string;
  estimatedTravelTime: string;
  bookingNumber: string;
  contractType: string;
  numberOfVerifiers: number;
  shippingCompanyId: number;
  departureHarborId: number;
  destinationHarborId: number;
  depositId: number;
  transportId: number;
  verifierId: number;
  bookingId: number | '';
  bookingContainerIds: number[];
  purchaseOrderLineId: number | '';
}

export const initialValues: ValuesProps = {
  boxQuantity: 0,
  boxBrandId: 0,
  merchantId: 0,
  businessId: 0,
  clientId: 0,
  cuttingDate: '',
  shippingDateTime: '',
  weekCutting: {
    description: '',
    daysOfWeek: ['', '', '', '', '', '', ''],
    boxesOfDay: [0, 0, 0, 0, 0, 0, 0],
    total: 0,
  },
  shipName: '',
  estimatedTravelTime: '',
  bookingNumber: '',
  contractType: '',
  numberOfVerifiers: 0,
  shippingCompanyId: 0,
  departureHarborId: 0,
  destinationHarborId: 0,
  depositId: 0,
  transportId: 0,
  verifierId: 0,
  bookingId: '',
  bookingContainerIds: [],
  purchaseOrderLineId: '',
};

const weekCuttingSchema = Yup.object().shape({
  description: Yup.string().required('La descripción es requerida'),
  daysOfWeek: Yup.array()
    .of(Yup.string().required('La fecha es requerida'))
    .length(7, 'Debe contener exactamente 7 elementos')
    .required('Los días de la semana son requeridos'),
  boxesOfDay: Yup.array()
    .of(Yup.number().required('La cantidad de cajas es requerida'))
    .length(7, 'Debe contener exactamente 7 elementos')
    .required('La cantidad de cajas por día es requerida'),
});

export const validationSchema = Yup.object({
  boxQuantity: Yup.number()
    .integer('Debe ser un número entero')
    .moreThan(0, 'Debe ser mayor que 0')
    .required('Requerido'),
  boxBrandId: Yup.number()
    .integer('Debe ser un número entero')
    .moreThan(0, 'Debe ser mayor que 0')
    .required('Requerido'),
  merchantId: Yup.number()
    .integer('Debe ser un número entero')
    .moreThan(0, 'Debe ser mayor que 0')
    .required('Requerido'),
  businessId: Yup.number()
    .integer('Debe ser un número entero')
    .moreThan(0, 'Debe ser mayor que 0')
    .required('Requerido'),
  clientId: Yup.number()
    .integer('Debe ser un número entero')
    .moreThan(0, 'Debe ser mayor que 0')
    .required('Requerido'),
  cuttingDate: Yup.date()
    .typeError('Fecha inválida, use DD/MM/AAAA')
    .required('Requerido'),
  shippingDateTime: Yup.date()
    .required('Requerido')
    .typeError('Fecha y hora inválidas: DD/MM/AAAA y HH:mm (24 horas)')
    .test(
      'is-after-cutting',
      'La fecha de envío no puede ser anterior a la fecha de corte',
      function (value) {
        const { cuttingDate } = this.parent;
        if (!value || !cuttingDate) return true;
        return new Date(value) >= new Date(cuttingDate);
      }
    ),
  weekCutting: weekCuttingSchema.test(
    'boxesOfDay-sum',
    'La sumatoria de cajas por día debe ser igual al total de cajas',
    function (value) {
      if (!value) return false;
      const { boxesOfDay } = value;
      const boxQuantity = this.parent.boxQuantity;
      const totalBoxes = boxesOfDay.reduce((acc, curr) => acc + curr, 0);
      return totalBoxes === boxQuantity;
    }
  ),
  shipName: Yup.string()
    .max(100, 'Debe tener 100 caracteres o menos')
    .min(2, 'Debe tener 2 caracteres o más')
    .trim()
    .required('Requerido'),
  // With a booking the travel time comes from its contract, which may not
  // have one.
  estimatedTravelTime: Yup.string().when('bookingId', {
    is: (bookingId: number | '') => !bookingId,
    then: (schema) =>
      schema
        .max(50, 'Debe tener 50 caracteres o menos')
        .min(2, 'Debe tener 2 caracteres o más')
        .trim()
        .required('Requerido'),
    otherwise: (schema) => schema.max(50, 'Debe tener 50 caracteres o menos'),
  }),
  bookingNumber: Yup.string()
    .max(50, 'Debe tener 50 caracteres o menos')
    .min(2, 'Debe tener 2 caracteres o más')
    .trim()
    .required('Requerido'),
  contractType: Yup.string()
    .max(50, 'Debe tener 50 caracteres o menos')
    .min(2, 'Debe tener 2 caracteres o más')
    .trim()
    .required('Requerido'),
  numberOfVerifiers: Yup.number()
    .integer('Debe ser un número entero')
    .moreThan(0, 'Debe ser mayor que 0')
    .required('Requerido'),
  shippingCompanyId: Yup.number()
    .integer('Debe ser un número entero')
    .moreThan(0, 'Debe ser mayor que 0')
    .required('Requerido'),
  departureHarborId: Yup.number()
    .integer('Debe ser un número entero')
    .moreThan(0, 'Debe ser mayor que 0')
    .required('Requerido'),
  destinationHarborId: Yup.number()
    .integer('Debe ser un número entero')
    .moreThan(0, 'Debe ser mayor que 0')
    .required('Requerido'),
  depositId: Yup.number()
    .integer('Debe ser un número entero')
    .moreThan(0, 'Debe ser mayor que 0')
    .required('Requerido'),
  transportId: Yup.number()
    .integer('Debe ser un número entero')
    .moreThan(0, 'Debe ser mayor que 0')
    .required('Requerido'),
  verifierId: Yup.number()
    .integer('Debe ser un número entero')
    .moreThan(0, 'Debe ser mayor que 0')
    .required('Requerido'),
});
