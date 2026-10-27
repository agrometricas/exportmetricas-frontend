'use client';

import { Box, Button, Center, Flex, Heading, Text } from '@chakra-ui/react';
import { Formik, Form } from 'formik';
import { useParams, useRouter } from 'next/navigation';
import React, { useState } from 'react';
import * as Yup from 'yup';
import InputFieldPassword from '@/components/ui/form/InputFieldPassword';
import { Logo } from '@/components/ui/Logo';
import { toaster } from '@/components/ui/toaster';

const ResetPasswordSchema = Yup.object({
  password: Yup.string()
    .min(6, 'Mínimo 6 caracteres')
    .required('La contraseña es obligatoria'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password')], 'Las contraseñas no coinciden')
    .required('Confirma tu contraseña'),
});

export default function ResetPasswordTokenPage(): React.JSX.Element {
  const { token } = useParams<{ token: string }>();
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);

  return (
    <Center minH='100vh'>
      <Flex direction='column' maxW='480px' w='100%' p={4}>
        <Logo width={150} height={150} align='center' />
        <Heading fontSize='2xl' mt={4} mb={2}>
          Nueva contraseña
        </Heading>
        <Text fontSize='sm' color='fg.muted' mb={8}>
          Ingresa una nueva contraseña segura y confírmala.
        </Text>

        <Formik
          initialValues={{ password: '', confirmPassword: '' }}
          validationSchema={ResetPasswordSchema}
          onSubmit={async (values) => {
            setSubmitting(true);
            try {
              const res = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/auth/exporter/reset-password`,
                {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({
                    token,
                    newPassword: values.password,
                  }),
                }
              );

              if (!res.ok) throw new Error('Token inválido o expirado');
              toaster.create({
                title: 'Contraseña actualizada',
                description: 'Ahora puedes iniciar sesión con tu nueva clave.',
                type: 'success',
                duration: 4000,
                closable: true,
              });
              router.replace('/auth/reset-password/success');
            } catch {
              toaster.create({
                title: 'Error',
                description: 'No se pudo actualizar la contraseña.',
                type: 'error',
                duration: 4000,
                closable: true,
              });
            } finally {
              setSubmitting(false);
            }
          }}
        >
          {() => (
            <Form>
              <Box mt={4}>
                <InputFieldPassword name='password' label='Nueva contraseña' />
              </Box>
              <Box mt={4}>
                <InputFieldPassword
                  name='confirmPassword'
                  label='Confirmar contraseña'
                />
              </Box>
              <Button
                type='submit'
                colorPalette='green'
                mt={6}
                loading={submitting}
                w='full'
              >
                Actualizar contraseña
              </Button>
            </Form>
          )}
        </Formik>
      </Flex>
    </Center>
  );
}
