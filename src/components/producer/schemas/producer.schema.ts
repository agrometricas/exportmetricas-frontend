import * as Yup from 'yup';
import { farmCodeSchema } from '../../../utils/farmCodes';
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

export interface BusinessesProps {
    name: string;
    countryId: number | '';
    provinceId: number | '';
    cityId: number | '';
    address: string;
    fruitType: string;
    area: number;
    latitude: number | 0;
    longitude: number | 0;
    codeMAGAP: string;
    codeAGROCALIDAD: string;
    certificates: number[];
    businessCodes: BusinessCodesProps[];
    contacts: ContactsProps[];
}

export interface ValuesProps {
    businessName: string;
    businessId: string;
    countryId: number | '';
    provinceId: number | '';
    cityId: number | '';
    address: string;
    email: string;
    contractType: '' | 'FOB' | 'FAS' | 'SPOT';
    businesses: BusinessesProps[];
}

export const initialValues: ValuesProps = {
    businessName: '',
    businessId: '',
    address: '',
    countryId: 1,
    provinceId: '',
    cityId: '',
    email: '',
    contractType: '',
    businesses: [
        {
            name: '',
            countryId: 1,
            provinceId: '',
            cityId: '',
            address: '',
            fruitType: '',
            area: 0,
            latitude: 0,
            longitude: 0,
            codeMAGAP: '',
            codeAGROCALIDAD: '',
            certificates: [],
            businessCodes: [{ code: '' }],
            contacts: [{ name: '', role: '', email: '', phone: '' }],
        },
    ],
};

const contactSchema = Yup.object().shape({
    name: Yup.string()
        .max(100)
        .min(2)
        .matches(/^[a-zA-Z\s]+$/, 'Solo debe contener letras y espacios')
        .transform((value) => value.trim())
        .required('Requerido'),
    role: Yup.string().max(100).min(2).transform((v) => v.trim()).required('Requerido'),
    email: Yup.string().email().max(50).transform((v) => v.trim()).required('Requerido'),
    phone: Yup.string()
        .matches(/^(\+593|0)9\d{8}$/, 'Debe comenzar con +593 o 09')
        .transform((v) => v.trim())
        .required('Requerido'),
});

const businessCodeSchema = Yup.object().shape({
    code: Yup.string()
        .min(5)
        .max(50)
        .matches(/^[a-zA-Z0-9]+$/, 'Solo letras y números')
        .transform((v) => v.trim())
        .required('Requerido'),
});

const businessSchema = Yup.object().shape({
    name: Yup.string()
        .max(100)
        .min(2)
        .matches(/^[a-zA-Z0-9\s]+$/)
        .transform((v) => v.trim())
        .required('Requerido'),
    address: Yup.string()
        .max(100)
        .matches(/^[a-zA-Z0-9\s.,'-]+$/)
        .transform((v) => v.trim()).required('Requerido'),
    fruitType: Yup.string()
        .oneOf(['Orgánica', 'Convencional'])
        .required('Requerido'),
    area: areaSchema,
    latitude: Yup.number().min(-90).max(90).notRequired(),
    longitude: Yup.number().min(-180).max(180).notRequired(),
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
    certificates: Yup.array()
        .of(Yup.number().typeError('Certificado inválido'))
        .min(1, 'Selecciona al menos un certificado')
        .required('Los certificados son requeridos'),
    codeMAGAP: farmCodeSchema('MAGAP'),
    codeAGROCALIDAD: farmCodeSchema('AGROCALIDAD'),
    businessCodes: Yup.array().of(businessCodeSchema).min(1),
    contacts: Yup.array().of(contactSchema).min(1),
});

export const validationSchema = Yup.object({
    businessName: Yup.string()
        .max(100)
        .min(2)
        .matches(/^[a-zA-Z0-9\s]+$/)
        .transform((v) => v.trim())
        .required('Requerido'),
    businessId: Yup.string()
        .length(13)
        .matches(/^\d{10}\d{3}$/)
        .transform((v) => v.trim())
        .required('Requerido'),
    address: Yup.string()
        .max(100)
        .matches(/^[a-zA-Z0-9\s.,'-]+$/)
        .transform((v) => v.trim()).required('Requerido'),
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
    email: Yup.string().email().max(50).transform((v) => v.trim()).required('Requerido'),
    contractType: Yup.string()
        .oneOf(['FOB', 'FAS', 'SPOT'])
        .required('Requerido'),
    businesses: Yup.array().of(businessSchema).min(1),
});
