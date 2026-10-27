'use client';
import { Button, Flex } from '@chakra-ui/react';
import { Formik, Form } from 'formik';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import * as Yup from 'yup';
import { toaster } from '@/components/ui/toaster';
import { env } from '../../lib/env';
import CheckboxForm from '../ui/form/CheckboxForm';
import InputFieldPassword from '../ui/form/InputFieldPassword';
import InputFieldText from '../ui/form/InputFieldText';

interface ValuesProps {
  exportName: string;
  exportId: string;
  name: string;
  email: string;
  password: string;
  terms: boolean;
}

const initialValues: ValuesProps = {
  exportName: '',
  exportId: '',
  name: '',
  email: '',
  password: '',
  terms: false,
};

const validationSchema = Yup.object({
  exportName: Yup.string()
    .max(50, 'Must be 50 characters or less')
    .required('Required'),
  exportId: Yup.string().required('Required'),
  name: Yup.string()
    .max(50, 'Must be 50 characters or less')
    .required('Required'),
  password: Yup.string()
    .min(4, 'Must be 4 or more character')
    .required('Required'),
  email: Yup.string().email('Invalid email address').required('Required'),
  terms: Yup.boolean().oneOf(
    [true],
    'You must accept the terms and conditions'
  ),
});

export default function SignUpForm(): React.JSX.Element {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const signUp = async (values: ValuesProps): Promise<void> => {
    setIsLoading(true);
    try {
      const res = await fetch(
        env.NEXT_PUBLIC_API_URL + '/auth/exporter/register',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            businessName: values.exportName,
            businessId: values.exportId,
            email: values.email,
            name: values.name,
            password: values.password,
          }),
        }
      );

      if (!res.ok) {
        const errorData = await res.json();
        toaster.create({
          title: `Error ${res.status}`,
          description: errorData.message,
          type: 'error',
          duration: 5000,
          closable: true,
        });
        return;
      }

      toaster.create({
        title: 'Registro exitoso',
        description: 'Su cuenta ha sido creada.',
        type: 'success',
        duration: 5000,
        closable: true,
      });

      router.push('/auth/signin');
    } catch (error) {
      toaster.create({
        title: 'Error de conexión',
        description: 'No se pudo conectar al servidor.',
        type: 'error',
        duration: 5000,
        closable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Formik
      initialValues={initialValues}
      onSubmit={signUp}
      validationSchema={validationSchema}
    >
      {({}) => (
        <Form>
          <Flex flexDirection='column' gap={3}>
            <InputFieldText name={'exportName'} label={'Razón Social'} />
            <InputFieldText name={'exportId'} label={'RUC'} />
            <InputFieldText name={'name'} label={'Nombre de Usuario'} />
            <InputFieldText name={'email'} label={'Correo'} />
            <InputFieldPassword name={'password'} label={'Contraseña'} />
            <CheckboxForm
              name={'terms'}
              label={'Acepta nuestros Términos y Condiciones'}
            />

            <Button
              mt='32px'
              py='8px'
              px='16px'
              type='submit'
              colorPalette='green'
              loading={isLoading}
            >
              Registrarse
            </Button>
          </Flex>
        </Form>
      )}
    </Formik>
  );
}
