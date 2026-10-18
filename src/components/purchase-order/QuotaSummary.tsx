import {
  Alert,
  AlertDescription,
  AlertIcon,
  Box,
  Flex,
  SimpleGrid,
  Spinner,
  Stat,
  StatLabel,
  StatNumber,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  useColorModeValue,
} from '@chakra-ui/react';
import React from 'react';
import { OrderQuota } from '../../types/purchaseOrder';

const boxes = (value: number | null): string =>
  value === null ? '—' : String(value);

export default function QuotaSummary({
  quota,
  isFetching,
}: {
  quota: OrderQuota | undefined;
  isFetching?: boolean;
}): React.JSX.Element {
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const mutedColor = useColorModeValue('gray.600', 'gray.400');

  if (!quota) {
    return (
      <Text fontSize='sm' color={mutedColor}>
        Elige el productor y la semana para ver el cupo de sus fincas.
      </Text>
    );
  }

  return (
    <Flex direction='column' gap={4}>
      <SimpleGrid columns={{ base: 1, sm: 3 }} spacing={4}>
        <Stat
          borderWidth='1px'
          borderColor={borderColor}
          borderRadius='lg'
          p={3}
        >
          <StatLabel>Cajas de contrato</StatLabel>
          <StatNumber>{boxes(quota.totals.contractBoxes)}</StatNumber>
        </Stat>
        <Stat
          borderWidth='1px'
          borderColor={borderColor}
          borderRadius='lg'
          p={3}
        >
          <StatLabel>Cajas spot</StatLabel>
          <StatNumber>{boxes(quota.totals.spotBoxes)}</StatNumber>
        </Stat>
        <Stat
          borderWidth='1px'
          borderColor={borderColor}
          borderRadius='lg'
          p={3}
        >
          <StatLabel>Total de la orden</StatLabel>
          <StatNumber>{boxes(quota.totals.boxes)}</StatNumber>
        </Stat>
      </SimpleGrid>

      {quota.quota.length === 0 ? (
        <Text fontSize='sm' color={mutedColor}>
          Ninguna finca de este productor tiene contrato vigente esa semana.
        </Text>
      ) : (
        <Box
          overflowX='auto'
          borderWidth='1px'
          borderColor={borderColor}
          borderRadius='lg'
        >
          <Table size='sm'>
            <Thead>
              <Tr>
                <Th>Finca</Th>
                <Th isNumeric>Cupo semanal</Th>
                <Th isNumeric>Contrato</Th>
                <Th isNumeric>Queda</Th>
                <Th isNumeric>Spot</Th>
              </Tr>
            </Thead>
            <Tbody>
              {quota.quota.map((row) => (
                <Tr key={row.business.id}>
                  <Td>{row.business.name}</Td>
                  <Td isNumeric>
                    {row.approvedWeeklyBoxes === null
                      ? 'Sin contrato'
                      : boxes(row.approvedWeeklyBoxes)}
                  </Td>
                  <Td isNumeric>{boxes(row.contractBoxes)}</Td>
                  <Td
                    isNumeric
                    color={
                      row.remaining !== null && row.remaining < 0
                        ? 'red.500'
                        : undefined
                    }
                    fontWeight='semibold'
                  >
                    {boxes(row.remaining)}
                  </Td>
                  <Td isNumeric>{boxes(row.spotBoxes)}</Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </Box>
      )}

      {quota.warnings.map((warning) => (
        <Alert key={warning} status='warning' borderRadius='lg'>
          <AlertIcon />
          <AlertDescription fontSize='sm'>{warning}</AlertDescription>
        </Alert>
      ))}
      {isFetching && <Spinner size='sm' alignSelf='flex-end' />}
    </Flex>
  );
}
