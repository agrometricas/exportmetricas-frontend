'use client';
import { Button, Center, Heading, Icon, Text, VStack } from '@chakra-ui/react';
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
  const titleColor = 'fg.heading';
  const textColor = 'fg.muted';
  return (
    <Center minH={minH} py={6}>
      <VStack gap={3} maxW='md' textAlign='center' role='alert'>
        <Icon boxSize={10} color='red.fg' asChild>
          <MdErrorOutline />
        </Icon>
        <Heading size='sm' color={titleColor}>
          {title}
        </Heading>
        <Text fontSize='sm' color={textColor}>
          {serverErrorMessage(error, 'Inténtalo de nuevo en un momento.')}
        </Text>
        {onRetry && (
          <Button
            size='sm'
            colorPalette='green'
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
