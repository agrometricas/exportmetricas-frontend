'use client';

import { Center, Flex, Heading, Text } from '@chakra-ui/react';
import { Logo } from '@/components/ui/Logo';

export default function AdjustmentSuccessPage(): JSX.Element {
  return (
    <Center minH='100vh'>
      <Flex
        direction='column'
        align='center'
        py='20px'
        px='16px'
        w={{ base: '288px', sm: '288px', md: '288px', lg: '480px' }}
      >
        <Logo width={150} height={150} />
        <Heading
          fontWeight='bold'
          fontSize='3xl'
          mt='0px'
          textAlign='center'
          color='green.fg'
        >
          Exportmétricas
        </Heading>
        <Heading fontSize='2xl' mt='32px' color='green.fg' textAlign='center'>
          ¡Ajuste enviado exitosamente!
        </Heading>
        <Text fontSize='md' mt='12px' textAlign='center' color='fg.muted'>
          Gracias por enviar el ajuste de materiales.
        </Text>
      </Flex>
    </Center>
  );
}
