import * as Yup from 'yup';

export interface ContactProps {
    name: string;
    email: string;
    phone: string;
}

export interface ValuesProps {
    name: string;
    ruc: string;
    address: string;
    contacts: ContactProps[];
}

export const initialValues: ValuesProps = {
    name: '',
    ruc: '',
    address: '',
    contacts: [{ name: '', email: '', phone: '' }],
};

export const validationSchema = Yup.object({
    name: Yup.string()
        .max(100, 'Debe tener 100 caracteres o menos')
        .min(2, 'Debe tener 2 caracteres o más')
        .trim()
        .required('Requerido'),
    ruc: Yup.string()
        .length(13, 'Debe tener exactamente 13 caracteres')
        .matches(/^\d{13}$/, 'El RUC debe ser numérico')
        .trim()
        .required('Requerido'),
    address: Yup.string()
        .max(150, 'Debe tener 150 caracteres o menos')
        .min(2, 'Debe tener 2 caracteres o más')
        .trim()
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
