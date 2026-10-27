import * as Yup from 'yup';
import { ClientTermValues } from '../../../utils/clientTerms';

export interface ContactProps {
  name: string;
  role: string;
  email: string;
  phone: string;
}

export interface ValuesProps extends ClientTermValues {
  businessName: string;
  businessId: string;
  address: string;
  type: '' | 'Supermercado' | 'Intermediario';
  commercialType: string;
  postalCode: string;
  email: string;
  phone: string;
  website: string;
  shippingMethod: string;
  countryId: number | '';
  provinceId: number | '';
  cityId: number | '';
  harbors: number[];
  incoterms: number[];
  certificates: number[];
  contacts: ContactProps[];
}

export const initialValues: ValuesProps = {
  businessName: '',
  businessId: '',
  address: '',
  type: '',
  commercialType: '',
  postalCode: '',
  email: '',
  phone: '',
  website: '',
  purchaseVolumeBoxes: '',
  purchaseVolumePeriod: '',
  paymentTermValue: '',
  paymentTermUnit: '',
  shippingMethod: '',
  countryId: 1,
  provinceId: '',
  cityId: '',
  harbors: [],
  incoterms: [],
  certificates: [],
  contacts: [{ name: '', role: '', email: '', phone: '' }],
};

export const validationSchema = Yup.object({
  businessName: Yup.string()
    .max(50, 'Debe tener 50 caracteres o menos')
    .min(2, 'Debe tener 2 caracteres o más')
    .required('Requerido'),
  businessId: Yup.string()
    .length(13, 'Debe tener exactamente 13 caracteres')
    .matches(
      /^\d{10}001$/,
      'El RUC del negocio debe estar en el formato xxxxxxxxxx001'
    )
    .required('Requerido'),
  address: Yup.string()
    .max(150, 'Debe tener 150 caracteres o menos')
    .min(2, 'Debe tener 2 caracteres o más')
    .required('Requerido'),
  type: Yup.string()
    .required('Requerido')
    .oneOf(['Supermercado', 'Intermediario'], 'Tipo inválido'),
  commercialType: Yup.string()
    .max(100, 'Debe tener 100 caracteres o menos')
    .min(2, 'Debe tener 2 caracteres o más')
    .required('Requerido'),
  postalCode: Yup.string()
    .max(10, 'Debe tener 10 caracteres o menos')
    .min(6, 'Debe tener al menos 6 caracteres')
    .required('Requerido'),
  email: Yup.string()
    .email('Correo electrónico inválido')
    .max(50, 'Debe tener 50 caracteres o menos')
    .required('Requerido'),
  phone: Yup.string()
    .matches(
      /^\+\d{7,15}$/,
      'Debes incluir el codigo del país. Ejemplo: +593987654321 (Ecuador)'
    )
    .trim()
    .required('Requerido'),
  website: Yup.string().url('Debe ser una URL válida'),
  purchaseVolumeBoxes: Yup.number()
    .transform((value, original) => (original === '' ? undefined : value))
    .typeError('Escribe la cantidad de cajas')
    .integer('Debe ser un número entero')
    .min(1, 'Debe ser al menos 1 caja'),
  purchaseVolumePeriod: Yup.string().when('purchaseVolumeBoxes', {
    is: (boxes: unknown) => boxes !== undefined && boxes !== '',
    then: (schema) => schema.required('Elige el período'),
  }),
  paymentTermValue: Yup.number()
    .transform((value, original) => (original === '' ? undefined : value))
    .typeError('Escribe el plazo en números')
    .integer('Debe ser un número entero')
    .min(0, 'No puede ser negativo; 0 es contado'),
  paymentTermUnit: Yup.string().when('paymentTermValue', {
    is: (value: unknown) => value !== undefined && value !== '',
    then: (schema) => schema.required('Elige la unidad del plazo'),
  }),
  shippingMethod: Yup.string()
    .max(100, 'Debe tener 100 caracteres o menos')
    .required('Requerido'),
  countryId: Yup.number().required('Requerido'),
  provinceId: Yup.number().required('Requerido'),
  cityId: Yup.number().required('Requerido'),
  harbors: Yup.array()
    .of(Yup.number().required())
    .min(1, 'Selecciona al menos un puerto')
    .required('Requerido'),
  incoterms: Yup.array()
    .of(Yup.number().required())
    .min(1, 'Selecciona al menos un incoterm')
    .required('Requerido'),
  certificates: Yup.array()
    .of(Yup.number().required())
    .min(1, 'Selecciona al menos un certificado')
    .required('Requerido'),
  contacts: Yup.array()
    .of(
      Yup.object().shape({
        name: Yup.string()
          .max(100, 'Debe tener 100 caracteres o menos')
          .min(2, 'Debe tener 2 caracteres o más')
          .required('Requerido'),
        role: Yup.string()
          .max(100, 'Debe tener 100 caracteres o menos')
          .min(2, 'Debe tener 2 caracteres o más')
          .required('Requerido'),
        email: Yup.string()
          .email('Correo electrónico inválido')
          .max(50, 'Debe tener 50 caracteres o menos')
          .required('Requerido'),
        phone: Yup.string()
          .matches(
            /^\+\d{7,15}$/,
            'Debes incluir el codigo del país. Ejemplo: +593987654321 (Ecuador)'
          )
          .trim()
          .required('Requerido'),
      })
    )
    .min(1, 'Debe tener al menos un contacto')
    .required('Requerido'),
});
