import {
  Alert,
  Box,
  Flex,
  SimpleGrid,
  Spinner,
  Stat,
  Table,
  Text,
} from '@chakra-ui/react';
import React from 'react';
import { OrderQuota } from '../../types/purchaseOrder';
import { useColorModeValue } from '../ui/color-mode';

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
      <SimpleGrid columns={{ base: 1, sm: 3 }} gap={4}>
        <Stat.Root
          borderWidth='1px'
          borderColor={borderColor}
          borderRadius='lg'
          p={3}
        >
          <Stat.Label>Cajas de contrato</Stat.Label>
          <Stat.ValueText>{boxes(quota.totals.contractBoxes)}</Stat.ValueText>
        </Stat.Root>
        <Stat.Root
          borderWidth='1px'
          borderColor={borderColor}
          borderRadius='lg'
          p={3}
        >
          <Stat.Label>Cajas spot</Stat.Label>
          <Stat.ValueText>{boxes(quota.totals.spotBoxes)}</Stat.ValueText>
        </Stat.Root>
        <Stat.Root
          borderWidth='1px'
          borderColor={borderColor}
          borderRadius='lg'
          p={3}
        >
          <Stat.Label>Total de la orden</Stat.Label>
          <Stat.ValueText>{boxes(quota.totals.boxes)}</Stat.ValueText>
        </Stat.Root>
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
          <Table.Root size='sm'>
            <Table.Header>
              <Table.Row>
                <Table.ColumnHeader>Finca</Table.ColumnHeader>
                <Table.ColumnHeader textAlign='end'>
                  Cupo semanal
                </Table.ColumnHeader>
                <Table.ColumnHeader textAlign='end'>
                  Contrato
                </Table.ColumnHeader>
                <Table.ColumnHeader textAlign='end'>Queda</Table.ColumnHeader>
                <Table.ColumnHeader textAlign='end'>Spot</Table.ColumnHeader>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {quota.quota.map((row) => (
                <Table.Row key={row.business.id}>
                  <Table.Cell>{row.business.name}</Table.Cell>
                  <Table.Cell textAlign='end'>
                    {row.approvedWeeklyBoxes === null
                      ? 'Sin contrato'
                      : boxes(row.approvedWeeklyBoxes)}
                  </Table.Cell>
                  <Table.Cell textAlign='end'>
                    {boxes(row.contractBoxes)}
                  </Table.Cell>
                  <Table.Cell
                    color={
                      row.remaining !== null && row.remaining < 0
                        ? 'red.500'
                        : undefined
                    }
                    fontWeight='semibold'
                    textAlign='end'
                  >
                    {boxes(row.remaining)}
                  </Table.Cell>
                  <Table.Cell textAlign='end'>
                    {boxes(row.spotBoxes)}
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table.Root>
        </Box>
      )}

      {quota.warnings.map((warning) => (
        <Alert.Root key={warning} status='warning' borderRadius='lg'>
          <Alert.Indicator />
          <Alert.Description fontSize='sm'>{warning}</Alert.Description>
        </Alert.Root>
      ))}
      {isFetching && <Spinner size='sm' alignSelf='flex-end' />}
    </Flex>
  );
}
