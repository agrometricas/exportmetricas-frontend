import * as Yup from 'yup';

export interface ContactProps {
    name: string;
    email: string;
    phone: string;
}

export interface ValuesProps {
    name: string;
    code: string;
    countryId: number | '';
    provinceId: number | '';
    cityId: number | '';
    address: string;
    latitude: number | '';
    longitude: number | '';
    openTime: string;
    closeTime: string;
    contacts: ContactProps[];
    is24Hours: boolean;
}

export const initialValues: ValuesProps = {
    name: '',
    code: '',
    countryId: 1,
    provinceId: '',
    cityId: '',
    address: '',
    latitude: '',
    longitude: '',
    openTime: '',
    closeTime: '',
    contacts: [{ name: '', email: '', phone: '' }],
    is24Hours: false,
};

export const validationSchema = Yup.object({
    name: Yup.string()
        .max(100, 'Debe tener 100 caracteres o menos')
        .min(2, 'Debe tener 2 caracteres o más')
        .trim()
        .required('Requerido'),
    code: Yup.string()
        .max(50, 'Debe tener 50 caracteres o menos')
        .min(2, 'Debe tener 2 caracteres o más')
        .matches(/^[A-Z0-9]+$/, 'Solo debe contener mayúsculas y números')
        .trim()
        .required('Requerido'),
    provinceId: Yup.number().required('Requerido'),
    cityId: Yup.number().required('Requerido'),
    address: Yup.string()
        .max(150, 'Debe tener 150 caracteres o menos')
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
        .matches(/^([01]\d|2[0-3]):([0-5]\d)$/, 'Debe tener el formato HH:mm')
        .required('Requerido'),
    closeTime: Yup.string()
        .matches(/^([01]\d|2[0-3]):([0-5]\d)$/, 'Debe tener el formato HH:mm')
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
                        'Debes incluir el codigo del país. Ejemplo: +593987654321 (Ecuador)'
                    )
                    .trim()
                    .required('Requerido'),
            })
        )
        .min(1, 'Debe tener al menos un contacto')
        .required('Requerido'),
});
