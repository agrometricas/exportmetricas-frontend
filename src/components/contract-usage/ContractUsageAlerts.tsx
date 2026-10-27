import { Alert, Box, Button, Card, Flex, Heading } from '@chakra-ui/react';
import Link_Next from 'next/link';
import React, { useMemo } from 'react';
import { useContractUsage } from '../../hooks/contract-usage/contractUsage';
import { startOfLocalDay } from '../../utils/dayMonthYear';
import { useColorModeValue } from '../ui/color-mode';

export default function ContractUsageAlerts(): React.JSX.Element | null {
  const today = useMemo(() => startOfLocalDay(new Date().toISOString()), []);
  const { usage } = useContractUsage(today);
  const cardBg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  if (!usage) return null;

  return (
    <Card.Root
      bg={cardBg}
      border='1px solid'
      borderColor={borderColor}
      borderRadius='xl'
      boxShadow='md'
    >
      <Card.Body>
        <Flex
          justify='space-between'
          align={{ base: 'stretch', sm: 'center' }}
          direction={{ base: 'column', sm: 'row' }}
          gap={3}
          mb={3}
        >
          <Heading size='sm'>Cupos de los contratos esta semana</Heading>
          <Button size='sm' variant='outline' colorPalette='green' asChild>
            <Link_Next href='/dashboard/producer/contract-usage'>
              Ver cupos
            </Link_Next>
          </Button>
        </Flex>
        {usage.warnings.length === 0 ? (
          <Alert.Root status='success' borderRadius='lg'>
            <Alert.Indicator />
            <Alert.Description fontSize='sm'>
              Ninguna finca pasó su cupo esta semana.
            </Alert.Description>
          </Alert.Root>
        ) : (
          <Box>
            {usage.warnings.map((warning) => (
              <Alert.Root key={warning} status='error' borderRadius='lg' mb={2}>
                <Alert.Indicator />
                <Alert.Description fontSize='sm'>{warning}</Alert.Description>
              </Alert.Root>
            ))}
          </Box>
        )}
      </Card.Body>
    </Card.Root>
  );
}
