'use client';
import { Center, Spinner, Text, VStack } from '@chakra-ui/react';
import React from 'react';
import { useColorModeValue } from '../color-mode';

interface LoadingStateProps {
  label?: string;
  minH?: string;
}

const LoadingState: React.FC<LoadingStateProps> = ({
  label = 'Cargando…',
  minH = '200px',
}) => {
  const color = useColorModeValue('gray.600', 'gray.300');
  return (
    <Center minH={minH} role='status' aria-live='polite'>
      <VStack gap={3}>
        <Spinner color='green.500' borderWidth='3px' size='lg' />
        <Text fontSize='sm' color={color}>
          {label}
        </Text>
      </VStack>
    </Center>
  );
};

export default LoadingState;
