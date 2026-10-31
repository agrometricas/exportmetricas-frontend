import {
  Alert,
  Badge,
  Box,
  Button,
  Flex,
  SimpleGrid,
  Table,
  Text,
} from '@chakra-ui/react';
import { Formik, useFormikContext } from 'formik';
import Link_Next from 'next/link';
import { useSearchParams } from 'next/navigation';
import React, { useMemo } from 'react';
import EmptyState from '@/components/ui/states/EmptyState';
import ErrorState from '@/components/ui/states/ErrorState';
import LoadingState from '@/components/ui/states/LoadingState';
import { isCompleteDay } from './schemas/purchaseOrder.schema';
import { usePurchaseOrderWeek } from '../../hooks/purchase-order/getPurchaseOrderWeek';
import { DemandRow, WeekDemand as Demand } from '../../types/purchaseOrder';
import { formatDayMonthYear, startOfLocalDay } from '../../utils/dayMonthYear';
import { getWeekInfo } from '../../utils/getWeekInfo';
import InputFieldDayDate from '../ui/form/InputFieldDayDate';

const assignHref = (row: DemandRow, week: string): string =>
  `/dashboard/export/weekly-plan/assign?${new URLSearchParams({
    client: String(row.client.id),
    boxBrand: String(row.boxBrand.id),
    week,
    pending: String(row.pendingBoxes),
  })}`;

function Pending({ row }: { row: DemandRow }): React.JSX.Element {
  if (row.excessBoxes > 0) {
    return (
      <Badge colorPalette='orange' variant='subtle'>
        {row.excessBoxes} de más
      </Badge>
    );
  }
  return row.pendingBoxes > 0 ? (
    <Text fontWeight='semibold'>{row.pendingBoxes}</Text>
  ) : (
    <Badge colorPalette='green' variant='subtle'>
      Completo
    </Badge>
  );
}

function DemandTable({
  demand,
  week,
}: {
  demand: Demand;
  week: string;
}): React.JSX.Element {
  return (
    <Box
      overflowX='auto'
      borderWidth='1px'
      borderColor='border'
      borderRadius='lg'
    >
      <Table.Root size='sm'>
        <Table.Header>
          <Table.Row>
            <Table.ColumnHeader>Cliente</Table.ColumnHeader>
            <Table.ColumnHeader>Alícuota</Table.ColumnHeader>
            <Table.ColumnHeader textAlign='end'>Pedido</Table.ColumnHeader>
            <Table.ColumnHeader>Asignado</Table.ColumnHeader>
            <Table.ColumnHeader textAlign='end'>Falta</Table.ColumnHeader>
            <Table.ColumnHeader />
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {demand.rows.map((row) => (
            <Table.Row key={`${row.client.id}-${row.boxBrand.id}`}>
              <Table.Cell>{row.client.businessName}</Table.Cell>
              <Table.Cell>{row.boxBrand.name}</Table.Cell>
              <Table.Cell textAlign='end'>
                <Text fontWeight='semibold'>{row.requestedBoxes}</Text>
                <Text fontSize='xs' color='fg.muted'>
                  contrato {row.contractBoxes} · spot {row.spotBoxes}
                </Text>
              </Table.Cell>
              <Table.Cell>
                <Text fontWeight='semibold'>{row.assignedBoxes}</Text>
                {row.exports.map((shipment) => (
                  <Text key={shipment.id} fontSize='xs' color='fg.muted'>
                    {shipment.business.name} · {shipment.boxQuantity} ·{' '}
                    {formatDayMonthYear(shipment.cuttingDate)} ·{' '}
                    {shipment.contractType === 'SPOT' ? 'spot' : 'contrato'}
                  </Text>
                ))}
              </Table.Cell>
              <Table.Cell textAlign='end'>
                <Pending row={row} />
              </Table.Cell>
              <Table.Cell textAlign='end'>
                <Button
                  size='sm'
                  colorPalette='green'
                  variant='outline'
                  asChild
                >
                  <Link_Next href={assignHref(row, week)}>
                    Asignar fincas
                  </Link_Next>
                </Button>
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
        <Table.Footer>
          <Table.Row>
            <Table.ColumnHeader colSpan={2}>
              Total de la semana
            </Table.ColumnHeader>
            <Table.ColumnHeader textAlign='end'>
              {demand.totals.requestedBoxes}
            </Table.ColumnHeader>
            <Table.ColumnHeader>
              {demand.totals.assignedBoxes}
            </Table.ColumnHeader>
            <Table.ColumnHeader textAlign='end'>
              {demand.totals.pendingBoxes}
            </Table.ColumnHeader>
            <Table.ColumnHeader />
          </Table.Row>
        </Table.Footer>
      </Table.Root>
    </Box>
  );
}

function WeekDemand(): React.JSX.Element {
  const { values } = useFormikContext<{ weekDay: string }>();
  const week = isCompleteDay(values.weekDay) ? values.weekDay : null;
  const { data, isLoading, error, refetch } = usePurchaseOrderWeek(week);

  return (
    <Flex direction='column' gap={5}>
      <SimpleGrid columns={{ base: 1, md: 2 }} gap={5}>
        <InputFieldDayDate
          name='weekDay'
          label='Semana'
          helperText={
            week
              ? getWeekInfo({ date: new Date(week) }).week
              : 'Escribe cualquier día de la semana.'
          }
        />
      </SimpleGrid>
      <Text fontSize='sm' color='fg.muted'>
        Lo que pidió cada cliente esa semana, con sus contratos y sus pedidos
        spot, contra las exportaciones que ya van para él. Asignar fincas crea
        esas exportaciones.
      </Text>
      {isLoading && <LoadingState />}
      {error ? <ErrorState error={error} onRetry={() => refetch()} /> : null}
      {data?.warnings.map((warning) => (
        <Alert.Root key={warning} status='warning' borderRadius='lg'>
          <Alert.Indicator />
          <Alert.Description fontSize='sm'>{warning}</Alert.Description>
        </Alert.Root>
      ))}
      {data && week && data.rows.length === 0 && (
        <EmptyState
          title='Ningún cliente pidió fruta esa semana'
          description='Carga sus contratos y pedidos spot en Órdenes de compra.'
        />
      )}
      {data && week && data.rows.length > 0 && (
        <DemandTable demand={data} week={week} />
      )}
    </Flex>
  );
}

export default function WeekDemandView(): React.JSX.Element {
  const params = useSearchParams();
  const initialValues = useMemo(
    () => ({
      weekDay: startOfLocalDay(params.get('week') ?? new Date().toISOString()),
    }),
    [params]
  );
  return (
    <Formik initialValues={initialValues} onSubmit={() => undefined}>
      <WeekDemand />
    </Formik>
  );
}
