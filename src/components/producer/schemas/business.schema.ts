import * as Yup from 'yup';
import { areaSchema } from '../../business/areaSchema';

export interface ContactsProps {
    name: string;
    role: string;
    email: string;
    phone: string;
}

export interface BusinessCodesProps {
    code: string;
}

export interface ValuesProps {
    name: string;
    area: number;
    codeMAGAP: string;
    codeAGROCALIDAD: string;
    fruitType: string;
    countryId: number | '';
    provinceId: number | '';
    cityId: number | '';
    address: string;
    latitude: number | 0;
    longitude: number | 0;
    certificates: number[];
    businessCodes: BusinessCodesProps[];
    contacts: ContactsProps[];
    merchant: number | '';
    dataReviewed: boolean;
}

const contactSchema = Yup.object().shape({
    name: Yup.string()
        .max(100, 'Solo debe contener 100 caracteres o menos')
        .min(2, 'Debe tener 2 caracteres o más')
        .matches(/^[a-zA-Z\s]+$/, 'Solo debe contener letras y espacios')
        .transform((value) => value.trim())
        .required('Requerido'),
    role: Yup.string()
        .max(100)
        .min(2)
        .transform((v) => v.trim())
        .required('Requerido'),
    email: Yup.string()
        .email('Correo electrónico inválido')
        .max(50)
        .transform((v) => v.trim())
        .required('Requerido'),
    phone: Yup.string()
        .matches(/^(\+593|0)9\d{8}$/, 'Debe comenzar con +593 o 09')
        .transform((v) => v.trim())
        .required('Requerido'),
});

const businessCodeSchema = Yup.object().shape({
    code: Yup.string()
        .min(5, 'Debe tener al menos 5 caracteres')
        .max(50, 'Debe tener 50 caracteres o menos')
        .matches(/^[a-zA-Z0-9]+$/, 'Solo letras y números')
        .transform((v) => v.trim())
        .required('Requerido'),
});

export const initialValues: ValuesProps = {
    name: '',
    area: 0,
    codeMAGAP: '',
    codeAGROCALIDAD: '',
    fruitType: '',
    countryId: 1,
    provinceId: '',
    cityId: '',
    address: '',
    latitude: 0,
    longitude: 0,
    certificates: [],
    businessCodes: [{ code: '' }],
    contacts: [{ name: '', role: '', email: '', phone: '' }],
    merchant: '',
    dataReviewed: false,
};

export const validationSchema = Yup.object({
    name: Yup.string()
        .max(100, 'Debe tener 100 caracteres o menos')
        .min(2, 'Debe tener 2 caracteres o más')
        .matches(/^[a-zA-Z0-9\s]+$/, 'Solo debe contener letras, números y espacios')
        .transform((v) => v.trim())
        .required('Requerido'),
    area: areaSchema,
    codeMAGAP: Yup.string()
        .min(5, 'Debe tener al menos 5 caracteres')
        .max(50, 'Debe tener 50 caracteres o menos')
        .matches(/^[a-zA-Z0-9]+$/, 'Solo debe contener letras y números')
        .transform((v) => v.trim())
        .required('Requerido'),
    codeAGROCALIDAD: Yup.string()
        .min(5, 'Debe tener al menos 5 caracteres')
        .max(50, 'Debe tener 50 caracteres o menos')
        .matches(/^[a-zA-Z0-9]+$/, 'Solo debe contener letras y números')
        .transform((v) => v.trim())
        .required('Requerido'),
    fruitType: Yup.string()
        .oneOf(['Orgánica', 'Convencional'], 'Tipo de fruta no válido')
        .required('Requerido'),
    countryId: Yup.number().required('Requerido'),
    provinceId: Yup.number()
        .transform((value, originalValue) => {
            if (originalValue === '' || originalValue === null || Number.isNaN(value)) {
                return undefined;
            }
            return value;
        })
        .when('countryId', {
            is: (val: number) => !!val,
            then: (schema) =>
                schema
                    .typeError('Provincia es requerida')
                    .required('Provincia es requerida'),
            otherwise: (schema) => schema.notRequired(),
        }),
    cityId: Yup.number()
        .typeError('Ciudad es requerida')
        .required('Ciudad es requerida'),
    address: Yup.string()
        .max(100, 'Debe tener 100 caracteres o menos')
        .matches(/^[a-zA-Z0-9\s.,'-]+$/, 'Dirección no válida')
        .transform((v) => v.trim())
        .required('Requerido'),
    latitude: Yup.number().min(-90, 'Debe ser al menos -90').max(90, 'Debe ser como máximo 90').notRequired(),
    longitude: Yup.number().min(-180, 'Debe ser al menos -180').max(180, 'Debe ser como máximo 180').notRequired(),
    certificates: Yup.array()
        .of(Yup.number().typeError('Certificado inválido'))
        .min(1, 'Debe seleccionar al menos un certificado')
        .required('Los certificados son requeridos'),
    businessCodes: Yup.array().of(businessCodeSchema).min(1, 'Debe tener al menos un código'),
    contacts: Yup.array().of(contactSchema).min(1, 'Debe tener al menos un contacto'),
    merchant: Yup.number().required('Requerido'),
    dataReviewed: Yup.boolean()
        .oneOf([true], 'Debes revisar los datos antes de enviar')
        .required('Requerido'),
});
