'use client';

import {
  Center,
  Spinner,
  Text,
  VStack,
  useColorModeValue,
} from '@chakra-ui/react';
import React from 'react';

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
      <VStack spacing={3}>
        <Spinner color='green.500' thickness='3px' size='lg' />
        <Text fontSize='sm' color={color}>
          {label}
        </Text>
      </VStack>
    </Center>
  );
};

export default LoadingState;
