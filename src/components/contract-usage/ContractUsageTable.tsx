import {
  Badge,
  Box,
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
import { FarmUsage } from '../../types/contractUsage';

function Status({ farm }: { farm: FarmUsage }): React.JSX.Element {
  if (farm.approvedWeeklyBoxes === null) {
    return (
      <Badge colorScheme='gray' variant='subtle'>
        Sin contrato
      </Badge>
    );
  }
  return farm.exceeded ? (
    <Badge colorScheme='red' variant='subtle'>
      Pasó el cupo
    </Badge>
  ) : (
    <Badge colorScheme='green' variant='subtle'>
      Dentro del cupo
    </Badge>
  );
}

export default function ContractUsageTable({
  farms,
}: {
  farms: FarmUsage[];
}): React.JSX.Element {
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const mutedColor = useColorModeValue('gray.600', 'gray.400');

  return (
    <Box
      overflowX='auto'
      borderWidth='1px'
      borderColor={borderColor}
      borderRadius='lg'
    >
      <Table size='sm'>
        <Thead>
          <Tr>
            <Th>Productor</Th>
            <Th>Finca</Th>
            <Th isNumeric>Cupo semanal</Th>
            <Th isNumeric>Exportado</Th>
            <Th isNumeric>Queda</Th>
            <Th>Estado</Th>
          </Tr>
        </Thead>
        <Tbody>
          {farms.map((farm) => (
            <Tr key={farm.business.id}>
              <Td>{farm.merchant?.businessName ?? '—'}</Td>
              <Td>{farm.business.name}</Td>
              <Td isNumeric>{farm.approvedWeeklyBoxes ?? '—'}</Td>
              <Td isNumeric>
                <Text fontWeight='semibold'>{farm.exportedBoxes}</Text>
                <Text fontSize='xs' color={mutedColor}>
                  contrato {farm.contractBoxes} · spot {farm.spotBoxes} · sin
                  orden {farm.unplannedBoxes}
                </Text>
              </Td>
              <Td
                isNumeric
                fontWeight='semibold'
                color={
                  farm.remaining !== null && farm.remaining < 0
                    ? 'red.500'
                    : undefined
                }
              >
                {farm.remaining ?? '—'}
              </Td>
              <Td>
                <Status farm={farm} />
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </Box>
  );
}
