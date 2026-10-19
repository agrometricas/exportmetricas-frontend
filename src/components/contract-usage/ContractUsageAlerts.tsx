import {
  Alert,
  AlertDescription,
  AlertIcon,
  Box,
  Button,
  Card,
  CardBody,
  Flex,
  Heading,
  useColorModeValue,
} from '@chakra-ui/react';
import Link_Next from 'next/link';
import React, { useMemo } from 'react';
import { useContractUsage } from '../../hooks/contract-usage/contractUsage';
import { startOfLocalDay } from '../../utils/dayMonthYear';

export default function ContractUsageAlerts(): React.JSX.Element | null {
  const today = useMemo(() => startOfLocalDay(new Date().toISOString()), []);
  const { usage } = useContractUsage(today);
  const cardBg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  if (!usage) return null;

  return (
    <Card
      bg={cardBg}
      border='1px solid'
      borderColor={borderColor}
      borderRadius='xl'
      boxShadow='md'
    >
      <CardBody>
        <Flex
          justify='space-between'
          align={{ base: 'stretch', sm: 'center' }}
          direction={{ base: 'column', sm: 'row' }}
          gap={3}
          mb={3}
        >
          <Heading size='sm'>Cupos de los contratos esta semana</Heading>
          <Button
            as={Link_Next}
            href='/dashboard/producer/contract-usage'
            size='sm'
            variant='outline'
            colorScheme='green'
          >
            Ver cupos
          </Button>
        </Flex>
        {usage.warnings.length === 0 ? (
          <Alert status='success' borderRadius='lg'>
            <AlertIcon />
            <AlertDescription fontSize='sm'>
              Ninguna finca pasó su cupo esta semana.
            </AlertDescription>
          </Alert>
        ) : (
          <Box>
            {usage.warnings.map((warning) => (
              <Alert key={warning} status='error' borderRadius='lg' mb={2}>
                <AlertIcon />
                <AlertDescription fontSize='sm'>{warning}</AlertDescription>
              </Alert>
            ))}
          </Box>
        )}
      </CardBody>
    </Card>
  );
}
