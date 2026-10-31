import { Badge, Box, Table, Text } from '@chakra-ui/react';
import React from 'react';
import { FarmUsage } from '../../types/contractUsage';

function Status({ farm }: { farm: FarmUsage }): React.JSX.Element {
  if (farm.approvedWeeklyBoxes === null) {
    return (
      <Badge colorPalette='gray' variant='subtle'>
        Sin contrato
      </Badge>
    );
  }
  return farm.exceeded ? (
    <Badge colorPalette='red' variant='subtle'>
      Pasó el cupo
    </Badge>
  ) : (
    <Badge colorPalette='green' variant='subtle'>
      Dentro del cupo
    </Badge>
  );
}

function ContractContainers({ farm }: { farm: FarmUsage }): React.JSX.Element {
  if (farm.price === null) return <Text>—</Text>;
  return (
    <>
      <Text fontWeight='semibold'>
        {farm.weeklyContainers === null
          ? `${farm.contractContainers} usados, sin tope`
          : `${farm.contractContainers} de ${farm.weeklyContainers}`}
      </Text>
      <Text fontSize='xs' color='fg.muted'>
        a ${farm.price} · spot {farm.spotContainers}
      </Text>
    </>
  );
}

export default function ContractUsageTable({
  farms,
}: {
  farms: FarmUsage[];
}): React.JSX.Element {
  const borderColor = 'border';
  const mutedColor = 'fg.muted';

  return (
    <Box
      overflowX='auto'
      borderWidth='1px'
      borderColor={borderColor}
      borderRadius='lg'
    >
      <Table.Root size='sm'>
        <Table.Header>
          <Table.Row>
            <Table.ColumnHeader>Productor</Table.ColumnHeader>
            <Table.ColumnHeader>Finca</Table.ColumnHeader>
            <Table.ColumnHeader textAlign='end'>
              Contenedores de contrato
            </Table.ColumnHeader>
            <Table.ColumnHeader textAlign='end'>Cupo MAGAP</Table.ColumnHeader>
            <Table.ColumnHeader textAlign='end'>Exportado</Table.ColumnHeader>
            <Table.ColumnHeader textAlign='end'>Queda</Table.ColumnHeader>
            <Table.ColumnHeader>Estado</Table.ColumnHeader>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {farms.map((farm) => (
            <Table.Row key={farm.business.id}>
              <Table.Cell>{farm.merchant?.businessName ?? '—'}</Table.Cell>
              <Table.Cell>{farm.business.name}</Table.Cell>
              <Table.Cell textAlign='end'>
                <ContractContainers farm={farm} />
              </Table.Cell>
              <Table.Cell textAlign='end'>
                {farm.approvedWeeklyBoxes ?? '—'}
              </Table.Cell>
              <Table.Cell textAlign='end'>
                <Text fontWeight='semibold'>{farm.exportedBoxes}</Text>
                <Text fontSize='xs' color={mutedColor}>
                  contrato {farm.contractBoxes} · spot {farm.spotBoxes}
                </Text>
              </Table.Cell>
              <Table.Cell
                fontWeight='semibold'
                color={
                  farm.remaining !== null && farm.remaining < 0
                    ? 'red.500'
                    : undefined
                }
                textAlign='end'
              >
                {farm.remaining ?? '—'}
              </Table.Cell>
              <Table.Cell>
                <Status farm={farm} />
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table.Root>
    </Box>
  );
}
