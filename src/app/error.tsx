'use client';

import { Box, Button, Heading, Text, VStack } from '@chakra-ui/react';
import React, { useEffect } from 'react';
import { reportClientError } from '@/lib/error-reporter';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}): React.JSX.Element {
  useEffect(() => {
    reportClientError('render-boundary', error);
  }, [error]);

  return (
    <Box minH='60vh' display='flex' alignItems='center' justifyContent='center'>
      <VStack gap={4} textAlign='center' px={6}>
        <Heading size='lg'>Algo salió mal</Heading>
        <Text color='fg.muted' maxW='md'>
          Ocurrió un error inesperado al mostrar esta página. Puedes
          reintentarlo; si el problema sigue, recarga la página o vuelve a
          iniciar sesión.
        </Text>
        <Button colorPalette='green' onClick={() => reset()}>
          Reintentar
        </Button>
      </VStack>
    </Box>
  );
}
