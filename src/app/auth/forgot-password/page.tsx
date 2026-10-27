'use client';

import { Button, Center, Flex, Heading, Link, Text } from '@chakra-ui/react';
import { Formik, Form } from 'formik';
import Link_Next from 'next/link';
import React from 'react';
import * as Yup from 'yup';
import InputFieldText from '@/components/ui/form/InputFieldText';
import { Logo } from '@/components/ui/Logo';
import { toaster } from '@/components/ui/toaster';

const ForgotPasswordSchema = Yup.object({
  email: Yup.string().email('Correo inválido').required('Requerido'),
});

export default function ForgotPasswordPage(): React.JSX.Element {
  return (
    <Center minH='100vh'>
      <Flex direction='column' w='100%' maxW='480px' p={4}>
        <Logo width={150} height={150} align='center' />
        <Heading fontSize='2xl' mt={4} mb={2}>
          Restablecer contraseña
        </Heading>
        <Text fontSize='sm' color='fg.muted' mb={8}>
          Introduce tu correo para recibir el enlace de recuperación.
        </Text>
        <Formik
          initialValues={{ email: '' }}
          validationSchema={ForgotPasswordSchema}
          onSubmit={async (values, { resetForm }) => {
            try {
              const res = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/auth/exporter/forgot-password`,
                {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify(values),
                }
              );
              if (!res.ok) throw new Error('Error al enviar');
              toaster.create({
                title: 'Correo enviado',
                description:
                  'Revisa tu bandeja para restablecer tu contraseña.',
                type: 'success',
                duration: 4000,
                closable: true,
              });
              resetForm();
            } catch {
              toaster.create({
                title: 'Error',
                description: 'No se pudo enviar el correo.',
                type: 'error',
                duration: 4000,
                closable: true,
              });
            }
          }}
        >
          <Form>
            <InputFieldText
              name='email'
              label='Correo electrónico'
              placeholder='Correo electrónico'
            />
            <Button
              type='submit'
              colorPalette='green'
              w='full'
              mt={4}
              size='md'
            >
              Enviar enlace
            </Button>
          </Form>
        </Formik>

        <Center>
          <Text mt='20px'>
            ¿No tienes una cuenta?{' '}
            <Link color='green.fg' asChild>
              <Link_Next href='/auth/signup'>Registrarse</Link_Next>
            </Link>
          </Text>
        </Center>

        <Center>
          <Text mt='20px'>
            ¿Ya estás registrado?{' '}
            <Link color='green.fg' asChild>
              <Link_Next href='/auth/signin'>Iniciar sesión</Link_Next>
            </Link>
          </Text>
        </Center>
      </Flex>
    </Center>
  );
}
