'use client';

import {
  Card,
  CardBody,
  Center,
  Flex,
  Heading,
  Link,
  Text,
} from '@chakra-ui/react';
import Link_Next from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import SignInForm from '../../../components/signin/SignInForm';
import { Logo } from '../../../components/ui/Logo';

function SignInFormWithParams(): JSX.Element {
  const searchParams = useSearchParams();
  return (
    <SignInForm
      error={searchParams.get('error') ?? undefined}
      callbackUrl={searchParams.get('callbackUrl') ?? undefined}
    />
  );
}

const SignInPage = (): JSX.Element => {
  return (
    <Center minH='100vh'>
      <Flex
        flexDirection='column'
        py='20px'
        px='16px'
        w={{
          base: '288px',
          sm: '288px',
          md: '288px',
          lg: '480px',
          xl: '480px',
          '2xl': '480px',
        }}
      >
        <Logo width={150} height={150} align='center' />
        <Heading
          fontWeight='bold'
          fontSize='3xl'
          mt='0px'
          textAlign={'center'}
          color={'green.700'}
        >
          Exportmétricas
        </Heading>
        <Heading fontWeight='bold' fontSize='2xl' mt='32px'>
          Hey, Bienvenido 👋
        </Heading>
        <Text fontSize='md' mt='8px'>
          Introduce la información que proporcionaste al registrarte.
        </Text>

        <Card variant='unstyled' mt='20px'>
          <CardBody w='100%'>
            {/* useSearchParams needs a Suspense boundary to build. */}
            <Suspense fallback={null}>
              <SignInFormWithParams />
            </Suspense>
          </CardBody>
        </Card>

        <Center>
          <Text mt='20px'>
            ¿No tienes una cuenta?{' '}
            <Link as={Link_Next} color='teal.500' href='/auth/signup'>
              Registrarse
            </Link>
          </Text>
        </Center>

        <Center>
          <Text mt='10px'>
            ¿Olvidaste tu contraseña?{' '}
            <Link as={Link_Next} color='teal.500' href='/auth/forgot-password'>
              Restablecer contraseña
            </Link>
          </Text>
        </Center>
      </Flex>
    </Center>
  );
};

export default SignInPage;
