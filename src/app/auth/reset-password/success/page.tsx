'use client';

import { Box, Button, Center, Flex, Heading, Text } from '@chakra-ui/react';
import Link from 'next/link';
import { Logo } from '@/components/ui/Logo';

export default function ResetSuccessPage(): JSX.Element {
  return (
    <Center minH='100vh' bg='gray.50'>
      <Flex direction='column' align='center' maxW='480px' w='100%' p={4}>
        <Logo width={150} height={150} />
        <Heading fontSize='2xl' mt={6} mb={2} color='green.700'>
          ¡Contraseña actualizada!
        </Heading>
        <Text fontSize='md' color='gray.600' textAlign='center'>
          Tu contraseña ha sido restablecida exitosamente.
        </Text>
        <Text fontSize='md' color='gray.600' textAlign='center'>
          Ahora puedes iniciar sesión con tu nueva contraseña.
        </Text>
        <Box mt={6}>
          <Link href='/auth/signin'>
            <Button colorPalette='green' size='md'>
              Ir a Iniciar Sesión
            </Button>
          </Link>
        </Box>
      </Flex>
    </Center>
  );
}
