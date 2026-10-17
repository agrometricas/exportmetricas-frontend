import * as Yup from 'yup';

export interface ContactsProps {
  name: string;
  email: string;
  phone: string;
}

export interface HarborInfo {
  harborDepartureId: number | '';
  harborDestinationId: number | '';
  estDuration: string;
}

export interface ValuesProps {
  name: string;
  code: string;
  countryId: number | '';
  frequencies: string;
  cargoType: string;
  trackingPlatform: string;
  harbors: HarborInfo[];
  contacts: ContactsProps[];
  dataReviewed: boolean;
}

export const initialValues: ValuesProps = {
  name: '',
  code: '',
  countryId: '',
  frequencies: '',
  cargoType: '',
  trackingPlatform: '',
  harbors: [
    {
      harborDepartureId: '',
      harborDestinationId: '',
      estDuration: '',
    },
  ],
  contacts: [{ name: '', email: '', phone: '' }],
  dataReviewed: false,
};

export const validationSchema = Yup.object({
  name: Yup.string()
    .max(50, 'Debe tener 50 caracteres o menos')
    .min(2, 'Debe tener 2 caracteres o más')
    .trim()
    .required('Requerido'),
  code: Yup.string()
    .max(50, 'Debe tener 50 caracteres o menos')
    .min(2, 'Debe tener 2 caracteres o más')
    .matches(/^[A-Z0-9]+$/, 'Solo debe contener mayúsculas y números')
    .trim()
    .required('Requerido'),
  countryId: Yup.number().required('Requerido'),
  frequencies: Yup.string()
    .max(50, 'Debe tener 50 caracteres o menos')
    .min(2, 'Debe tener 2 caracteres o más')
    .trim()
    .required('Requerido'),
  cargoType: Yup.string()
    .max(100, 'Debe tener 100 caracteres o menos')
    .min(2, 'Debe tener 2 caracteres o más')
    .trim()
    .required('Requerido'),
  trackingPlatform: Yup.string()
    .url('Debe incluir http:// o https:// (Ej: https://plataforma.com)')
    .trim(),
  harbors: Yup.array()
    .of(
      Yup.object().shape({
        harborDepartureId: Yup.number().required('Puerto de salida requerido'),
        harborDestinationId: Yup.number().required(
          'Puerto de destino requerido'
        ),
        estDuration: Yup.string()
          .max(50, 'Máximo 50 caracteres')
          .min(2, 'Mínimo 2 caracteres')
          .trim()
          .required('Tiempo estimado requerido'),
      })
    )
    .min(1, 'Debe ingresar al menos un par de puertos')
    .required('Requerido'),
  contacts: Yup.array()
    .of(
      Yup.object().shape({
        name: Yup.string()
          .max(100, 'Debe tener 100 caracteres o menos')
          .min(2, 'Debe tener 2 caracteres o más')
          .trim()
          .required('Requerido'),
        email: Yup.string()
          .email('Correo electrónico inválido')
          .max(50, 'Debe tener 50 caracteres o menos')
          .trim()
          .required('Requerido'),
        phone: Yup.string()
          .matches(
            /^\+\d{7,15}$/,
            'Debes incluir el codigo del País. Ejemplo: +593987654321 (Ecuador)'
          )
          .trim()
          .required('Requerido'),
      })
    )
    .min(1, 'Debe ingresar al menos un contacto')
    .required('Requerido'),
  dataReviewed: Yup.boolean()
    .oneOf([true], 'Debes revisar los datos antes de enviar')
    .required('Requerido'),
});
