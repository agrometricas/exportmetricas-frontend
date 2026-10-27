import * as Yup from 'yup';

export interface HarborContactProps {
  name: string;
  web: string;
  email: string;
  phone: string;
}

export interface ValuesProps {
  type: '' | 'Nacional' | 'Internacional';
  name: string;
  code: string;
  address: string;
  location: string;
  latitude: number | '';
  longitude: number | '';
  openTime: string;
  closeTime: string;
  daysOfOperation: string[];
  countryId: number | '';
  provinceId: number | '';
  cityId: number | '';
  contacts: HarborContactProps[];
  is24Hours: boolean;
}

export const initialValues: ValuesProps = {
  type: '',
  name: '',
  code: '',
  address: '',
  location: '',
  latitude: '',
  longitude: '',
  openTime: '',
  closeTime: '',
  daysOfOperation: [],
  countryId: '',
  provinceId: '',
  cityId: '',
  contacts: [{ name: '', web: '', email: '', phone: '' }],
  is24Hours: false,
};

const contactSchema = Yup.object().shape({
  name: Yup.string()
    .max(100, 'Debe tener 100 caracteres o menos')
    .min(2, 'Debe tener 2 caracteres o más')
    .trim()
    .required('Requerido'),
  web: Yup.string()
    .max(100, 'Debe tener 100 caracteres o menos')
    .min(2, 'Debe tener 2 caracteres o más')
    .trim()
    .notRequired(),
  email: Yup.string()
    .email('Correo electrónico inválido')
    .max(50, 'Debe tener 50 caracteres o menos')
    .trim()
    .required('Requerido'),
  phone: Yup.string()
    .matches(
      /^\+\d{7,15}$/,
      'Debes incluir el codigo del país. Ejemplo: +593987654321 (Ecuador)'
    )
    .trim()
    .required('Requerido'),
});

export const validationSchema = Yup.object({
  type: Yup.string()
    .required('Requerido')
    .oneOf(['Nacional', 'Internacional'], 'Debes seleccionar'),
  name: Yup.string()
    .max(100, 'Debe tener 100 caracteres o menos')
    .min(2, 'Debe tener 2 caracteres o más')
    .trim()
    .required('Requerido'),
  code: Yup.string()
    .max(50, 'Debe tener 50 caracteres o menos')
    .min(2, 'Debe tener 2 caracteres o más')
    .matches(/^[a-zA-Z0-9]+$/, 'Solo debe contener letras y números')
    .trim()
    .required('Requerido'),
  address: Yup.string()
    .max(150, 'Debe tener 150 caracteres o menos')
    .min(2, 'Debe tener 2 caracteres o más')
    .trim()
    .required('Requerido'),
  location: Yup.string()
    .max(100, 'Debe tener 100 caracteres o menos')
    .min(2, 'Debe tener 2 caracteres o más')
    .trim()
    .required('Requerido'),
  latitude: Yup.number()
    .min(-90, 'Debe ser al menos -90')
    .max(90, 'Debe ser como máximo 90')
    .notRequired(),
  longitude: Yup.number()
    .min(-180, 'Debe ser al menos -180')
    .max(180, 'Debe ser como máximo 180')
    .notRequired(),
  openTime: Yup.string()
    .max(15, 'Debe tener 15 caracteres o menos')
    .matches(/^([01]\d|2[0-3]):([0-5]\d)$/, 'Debe tener el formato HH:mm')
    .required('Requerido'),
  closeTime: Yup.string()
    .max(15, 'Debe tener 15 caracteres o menos')
    .matches(/^([01]\d|2[0-3]):([0-5]\d)$/, 'Debe tener el formato HH:mm')
    .required('Requerido'),
  daysOfOperation: Yup.array()
    .of(Yup.string().trim().required('Requerido'))
    .min(1, 'Debes seleccionar al menos un día')
    .required('Requerido'),
  countryId: Yup.number().required('Requerido'),
  provinceId: Yup.number().required('Requerido'),
  cityId: Yup.number().required('Requerido'),
  contacts: Yup.array()
    .of(contactSchema)
    .min(1, 'Debes tener al menos un contacto')
    .required('Requerido'),
});
