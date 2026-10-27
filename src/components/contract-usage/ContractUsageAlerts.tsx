import { Alert, Box, Button, Card, Flex, Text } from '@chakra-ui/react';
import Link_Next from 'next/link';
import React, { useMemo } from 'react';
import { useContractUsage } from '../../hooks/contract-usage/contractUsage';
import { startOfLocalDay } from '../../utils/dayMonthYear';

export default function ContractUsageAlerts(): React.JSX.Element | null {
  const today = useMemo(() => startOfLocalDay(new Date().toISOString()), []);
  const { usage } = useContractUsage(today);

  if (!usage) return null;

  return (
    <Card.Root boxShadow='sm'>
      <Card.Body p={4}>
        <Flex
          justify='space-between'
          align={{ base: 'stretch', sm: 'center' }}
          direction={{ base: 'column', sm: 'row' }}
          gap={3}
          mb={3}
        >
          <Text as='h3' textStyle='md' fontWeight='semibold' color='fg.heading'>
            Cupos de los contratos esta semana
          </Text>
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
