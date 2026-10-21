import * as Yup from 'yup';
import {
  BusinessDetail,
  BusinessUpdateBody,
} from '../../../types/merchant/businessDetail';
import { isHectares } from '../areaSchema';

export interface CodeValues {
  id?: number;
  code: string;
}

export interface ContactValues {
  id?: number;
  name: string;
  role: string;
  email: string;
  phone: string;
}

export interface EditBusinessValues {
  name: string;
  area: string;
  fruitType: string;
  codeMAGAP: string;
  codeAGROCALIDAD: string;
  countryId: number | '';
  provinceId: number | '';
  cityId: number | '';
  address: string;
  latitude: string;
  longitude: string;
  certificates: number[];
  businessCodes: CodeValues[];
  contacts: ContactValues[];
}

export const emptyContact: ContactValues = {
  name: '',
  role: '',
  email: '',
  phone: '',
};

const text = (value: number | null): string =>
  value === null || value === undefined ? '' : String(value);

export function valuesFromBusiness(
  business: BusinessDetail
): EditBusinessValues {
  return {
    name: business.name,
    area: String(business.area),
    fruitType: business.fruitType,
    codeMAGAP: business.codeMAGAP,
    codeAGROCALIDAD: business.codeAGROCALIDAD,
    countryId: business.country?.id ?? '',
    provinceId: business.province?.id ?? '',
    cityId: business.city?.id ?? '',
    address: business.address ?? '',
    latitude: text(business.latitude),
    longitude: text(business.longitude),
    certificates: business.certificates.map(
      ({ certificate }) => certificate.id
    ),
    businessCodes: business.businessCodes.map(({ id, code }) => ({ id, code })),
    contacts: business.contacts.map((contact) => ({
      id: contact.id,
      name: contact.name,
      role: contact.role ?? '',
      email: contact.email ?? '',
      phone: contact.phone,
    })),
  };
}

const place = (id: number | ''): number | null => (id === '' ? null : id);
const coordinate = (value: string): number | null =>
  value.trim() === '' ? null : Number(value);

// A row keeps its id so the backend updates it instead of creating another;
// a row taken out of the list is the one the backend removes. An empty list
// is left out: a farm saved without codes or contacts keeps none.
export function editBusinessBody(
  values: EditBusinessValues
): BusinessUpdateBody {
  return {
    name: values.name.trim(),
    area: Number(values.area),
    fruitType: values.fruitType,
    codeMAGAP: values.codeMAGAP.trim(),
    codeAGROCALIDAD: values.codeAGROCALIDAD.trim(),
    countryId: place(values.countryId),
    provinceId: place(values.provinceId),
    cityId: place(values.cityId),
    address: values.address.trim(),
    latitude: coordinate(values.latitude),
    longitude: coordinate(values.longitude),
    certificates: values.certificates,
    ...(values.businessCodes.length > 0 && {
      businessCodes: values.businessCodes.map(({ id, code }) => ({
        ...(id ? { id } : {}),
        code: code.trim(),
      })),
    }),
    ...(values.contacts.length > 0 && {
      contacts: values.contacts.map(({ id, name, role, email, phone }) => ({
        ...(id ? { id } : {}),
        name: name.trim(),
        role: role.trim() || null,
        email: email.trim() || null,
        phone: phone.trim(),
      })),
    }),
  };
}

const NUMBER = /^-?\d+(\.\d+)?$/;
const optionalNumber = (
  min: number,
  max: number,
  label: string
): Yup.StringSchema<string | undefined> =>
  Yup.string().test(
    'rango',
    `${label} entre ${min} y ${max}`,
    (value) =>
      !value?.trim() ||
      (NUMBER.test(value.trim()) &&
        Number(value) >= min &&
        Number(value) <= max)
  );

// The same limits the backend enforces: the edit has to accept whatever the
// farm was created or imported with.
export const editBusinessSchema = Yup.object({
  name: Yup.string().trim().required('Requerido').max(100, 'Máximo 100'),
  area: Yup.string()
    .required('Requerido')
    .test('area', 'Mayor que 0 y con hasta dos decimales', (value) =>
      isHectares(value)
    ),
  fruitType: Yup.string()
    .oneOf(['Orgánica', 'Convencional'], 'Tipo de fruta no válido')
    .required('Requerido'),
  codeMAGAP: Yup.string().trim().required('Requerido'),
  codeAGROCALIDAD: Yup.string().trim().required('Requerido'),
  latitude: optionalNumber(-90, 90, 'La latitud va'),
  longitude: optionalNumber(-180, 180, 'La longitud va'),
  businessCodes: Yup.array()
    .of(
      Yup.object({
        code: Yup.string()
          .trim()
          .required('Requerido')
          .min(5, 'Entre 5 y 20 caracteres')
          .max(20, 'Entre 5 y 20 caracteres')
          .matches(/^[a-zA-Z0-9]*$/, 'Solo letras y números'),
      })
    )
    .required(),
  contacts: Yup.array()
    .of(
      Yup.object({
        name: Yup.string().trim().required('Requerido'),
        email: Yup.string().trim().email('Correo inválido'),
        phone: Yup.string()
          .trim()
          .required('Requerido')
          .matches(/^(\+[0-9]{1,3})?[0-9]{7,14}$/, 'Teléfono no válido'),
      })
    )
    .required(),
});
