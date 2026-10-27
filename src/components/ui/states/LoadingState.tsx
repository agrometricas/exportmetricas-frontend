'use client';
import { Center, Spinner, Text, VStack } from '@chakra-ui/react';
import React from 'react';

interface LoadingStateProps {
  label?: string;
  minH?: string;
}

const LoadingState: React.FC<LoadingStateProps> = ({
  label = 'Cargando…',
  minH = '200px',
}) => {
  const color = 'fg.muted';
  return (
    <Center minH={minH} role='status' aria-live='polite'>
      <VStack gap={3}>
        <Spinner color='green.fg' borderWidth='3px' size='lg' />
        <Text fontSize='sm' color={color}>
          {label}
        </Text>
      </VStack>
    </Center>
  );
};

export default LoadingState;
