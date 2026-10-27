'use client';

import { Card, Center, Flex, Heading, Link, Text } from '@chakra-ui/react';
import Link_Next from 'next/link';
import React from 'react';
import SignUpForm from '../../../components/signup/SignUpForm';
import { Logo } from '../../../components/ui/Logo';

const SignUpPage = (): React.JSX.Element => {
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
        <Logo align='left' width={60} height={60} />
        <Heading
          color='blackAlpha.900'
          fontWeight='bold'
          fontSize='3xl'
          mt='24px'
        >
          Hey, hola 👋
        </Heading>
        <Text color='blackAlpha.700' fontSize='md' mt='8px'>
          Crea una cuenta para empezar a usar ...
        </Text>

        <Card.Root mt='20px' unstyled>
          <Card.Body w='100%'>
            <SignUpForm />
          </Card.Body>
        </Card.Root>

        <Center>
          <Text mt='20px'>
            ¿Ya estás registrado?{' '}
            <Link color='green.fg' asChild><Link_Next href='/auth/signin'>Iniciar sesión
                          </Link_Next></Link>
          </Text>
        </Center>
      </Flex>
    </Center>
  );
};

export default SignUpPage;
