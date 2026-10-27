/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';
import { Center, Flex, Heading, Button, Text } from '@chakra-ui/react';
import { useRouter } from 'next/navigation';
import { signOut, useSession } from 'next-auth/react';
import React, { useEffect } from 'react';
import LoadingState from '@/components/ui/states/LoadingState';

const SignOutPage = (): React.JSX.Element => {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin');
    }
  }, [status, router]);

  const handleSignOut = async (): Promise<void> => {
    await signOut({ redirect: false });
  };

  if (status === 'loading') return <LoadingState minH='100vh' />;

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
        <Heading fontWeight='bold' fontSize='3xl' mt='24px'>
          Estas Saliendo de la Web 👋
        </Heading>
        <Text fontSize='md' mt='8px'>
          ¿Seguro que quieres cerrar sesión?
        </Text>

        <Button
          mt='32px'
          py='8px'
          px='16px'
          colorPalette='green'
          onClick={handleSignOut}
        >
          Cerrar Sesión
        </Button>
      </Flex>
    </Center>
  );
};

export default SignOutPage;
