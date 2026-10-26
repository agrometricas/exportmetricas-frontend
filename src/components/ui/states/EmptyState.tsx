'use client';

import {
  Center,
  Heading,
  Icon,
  Text,
  VStack,
  useColorModeValue,
} from '@chakra-ui/react';
import React from 'react';
import { IconType } from 'react-icons';
import { MdInbox } from 'react-icons/md';

interface EmptyStateProps {
  title: string;
  description?: string;
  icon?: IconType;
  action?: React.ReactNode;
  minH?: string;
}

const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  description,
  icon = MdInbox,
  action,
  minH = '200px',
}) => {
  const iconColor = useColorModeValue('gray.400', 'gray.500');
  const titleColor = useColorModeValue('gray.900', 'gray.100');
  const textColor = useColorModeValue('gray.600', 'gray.300');
  return (
    <Center minH={minH} py={6}>
      <VStack spacing={2} maxW='md' textAlign='center'>
        <Icon as={icon} boxSize={10} color={iconColor} />
        <Heading size='sm' color={titleColor}>
          {title}
        </Heading>
        {description && (
          <Text fontSize='sm' color={textColor}>
            {description}
          </Text>
        )}
        {action}
      </VStack>
    </Center>
  );
};

export default EmptyState;
