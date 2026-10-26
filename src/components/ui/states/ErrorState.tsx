'use client';

import {
  Button,
  Center,
  Heading,
  Icon,
  Text,
  VStack,
  useColorModeValue,
} from '@chakra-ui/react';
import React from 'react';
import { MdErrorOutline } from 'react-icons/md';
import { serverErrorMessage } from '../../../utils/serverErrorMessage';

interface ErrorStateProps {
  error: unknown;
  title?: string;
  onRetry?: () => void;
  minH?: string;
}

const ErrorState: React.FC<ErrorStateProps> = ({
  error,
  title = 'No se pudo cargar',
  onRetry,
  minH = '200px',
}) => {
  const titleColor = useColorModeValue('gray.900', 'gray.100');
  const textColor = useColorModeValue('gray.600', 'gray.300');
  return (
    <Center minH={minH} py={6}>
      <VStack spacing={3} maxW='md' textAlign='center' role='alert'>
        <Icon as={MdErrorOutline} boxSize={10} color='red.400' />
        <Heading size='sm' color={titleColor}>
          {title}
        </Heading>
        <Text fontSize='sm' color={textColor}>
          {serverErrorMessage(error, 'Inténtalo de nuevo en un momento.')}
        </Text>
        {onRetry && (
          <Button
            size='sm'
            colorScheme='green'
            variant='outline'
            onClick={onRetry}
          >
            Reintentar
          </Button>
        )}
      </VStack>
    </Center>
  );
};

export default ErrorState;
