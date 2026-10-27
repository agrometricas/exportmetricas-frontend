import {
  Box,
  Flex,
  SimpleGrid,
  Stat,
  Table,
  Tabs,
  Text,
} from '@chakra-ui/react';
import { Formik, useFormikContext } from 'formik';
import React, { useMemo } from 'react';
import LoadingState from '@/components/ui/states/LoadingState';
import { counterpartRange, startOfMonth } from './counterpartRange';
import { useCounterpartTotals } from '../../hooks/reports/counterpartTotals';
import {
  CounterpartCounts,
  CounterpartReport,
  ProducerTotals,
} from '../../types/counterpartTotals';
import { startOfLocalDay } from '../../utils/dayMonthYear';
import InputFieldDayDate from '../ui/form/InputFieldDayDate';

type Column<T> = {
  header: string;
  numeric?: boolean;
  value: (row: T) => React.ReactNode;
};

const usd = (value: string): string => `$${value}`;
const of = (part: number, total: number): string => `${part} de ${total}`;

function TotalsTable<T extends CounterpartCounts>({
  rows,
  columns,
  empty,
}: {
  rows: T[];
  columns: Column<T>[];
  empty: string;
}): React.JSX.Element {
  const borderColor = 'border';
  const mutedColor = 'fg.muted';
  if (rows.length === 0) {
    return (
      <Text fontSize='sm' color={mutedColor}>
        {empty}
      </Text>
    );
  }
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
            {columns.map((column) => (
              <Table.ColumnHeader key={column.header} textAlign='end'>
                {column.header}
              </Table.ColumnHeader>
            ))}
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {rows.map((row) => (
            <Table.Row key={row.id}>
              {columns.map((column) => (
                <Table.Cell key={column.header} textAlign='end'>
                  {column.value(row)}
                </Table.Cell>
              ))}
            </Table.Row>
          ))}
        </Table.Body>
      </Table.Root>
    </Box>
  );
}

const name = <T extends CounterpartCounts>(header: string): Column<T> => ({
  header,
  value: (row) => row.name,
});
const exportsColumn = <T extends CounterpartCounts>(): Column<T> => ({
  header: 'Exportaciones',
  numeric: true,
  value: (row) => row.exports,
});
const boxesColumn = <T extends CounterpartCounts>(): Column<T> => ({
  header: 'Cajas',
  numeric: true,
  value: (row) => row.boxes,
});
const containersColumn = <T extends CounterpartCounts>(): Column<T> => ({
  header: 'Contenedores',
  numeric: true,
  value: (row) => row.containers,
});
const paidColumn = <T extends ProducerTotals>(): Column<T> => ({
  header: 'Pagado',
  numeric: true,
  value: (row) => (
    <>
      <Text fontWeight='semibold'>{usd(row.paid)}</Text>
      <Text fontSize='xs' color='fg.muted'>
        {of(row.paidExports, row.exports)} pagadas
      </Text>
    </>
  ),
});

function ReportTabs({
  report,
}: {
  report: CounterpartReport;
}): React.JSX.Element {
  return (
    <Tabs.Root
      colorPalette='green'
      variant='enclosed'
      lazyMount
      defaultValue='clientes'
    >
      <Tabs.List overflowX='auto' overflowY='hidden'>
        <Tabs.Trigger value='clientes'>Clientes</Tabs.Trigger>
        <Tabs.Trigger value='productores'>Productores</Tabs.Trigger>
        <Tabs.Trigger value='fincas'>Fincas</Tabs.Trigger>
        <Tabs.Trigger value='puertos'>Puertos</Tabs.Trigger>
        <Tabs.Trigger value='navieras'>Navieras</Tabs.Trigger>
        <Tabs.Trigger value='depositos'>Depósitos</Tabs.Trigger>
        <Tabs.Trigger value='verificadoras'>Verificadoras</Tabs.Trigger>
      </Tabs.List>
      <Tabs.Content value='clientes' px={0}>
        <TotalsTable
          rows={report.clients}
          empty='Ninguna exportación en el período.'
          columns={[
            name('Cliente'),
            exportsColumn(),
            boxesColumn(),
            containersColumn(),
            {
              header: 'Cobrado',
              numeric: true,
              value: (row) => (
                <>
                  <Text fontWeight='semibold'>{usd(row.collected)}</Text>
                  <Text fontSize='xs' color='fg.muted'>
                    {of(row.collectedExports, row.exports)} cobradas
                  </Text>
                </>
              ),
            },
            {
              header: 'Pagado a productores',
              numeric: true,
              value: (row) => usd(row.producerPaid),
            },
            {
              header: 'Flete',
              numeric: true,
              value: (row) => usd(row.freight),
            },
          ]}
        />
      </Tabs.Content>
      <Tabs.Content value='productores' px={0}>
        <TotalsTable
          rows={report.producers}
          empty='Ninguna exportación en el período.'
          columns={[
            name('Productor'),
            exportsColumn(),
            boxesColumn(),
            paidColumn(),
          ]}
        />
      </Tabs.Content>
      <Tabs.Content value='fincas' px={0}>
        <TotalsTable
          rows={report.farms}
          empty='Ninguna exportación en el período.'
          columns={[
            name('Finca'),
            { header: 'Productor', value: (row) => row.producer ?? '—' },
            exportsColumn(),
            boxesColumn(),
            containersColumn(),
            paidColumn(),
          ]}
        />
      </Tabs.Content>
      <Tabs.Content value='puertos' px={0}>
        <Flex direction='column' gap={4}>
          <Text fontWeight='semibold'>Salida</Text>
          <TotalsTable
            rows={report.departureHarbors}
            empty='Ninguna exportación en el período.'
            columns={[
              name('Puerto'),
              exportsColumn(),
              boxesColumn(),
              containersColumn(),
            ]}
          />
          <Text fontWeight='semibold'>Destino</Text>
          <TotalsTable
            rows={report.destinationHarbors}
            empty='Ninguna exportación en el período.'
            columns={[
              name('Puerto'),
              exportsColumn(),
              boxesColumn(),
              containersColumn(),
            ]}
          />
        </Flex>
      </Tabs.Content>
      <Tabs.Content value='navieras' px={0}>
        <TotalsTable
          rows={report.shippingCompanies}
          empty='Ninguna exportación con naviera en el período.'
          columns={[
            name('Naviera'),
            exportsColumn(),
            boxesColumn(),
            containersColumn(),
            {
              header: 'Flete',
              numeric: true,
              value: (row) => (
                <>
                  <Text fontWeight='semibold'>{usd(row.freight)}</Text>
                  <Text fontSize='xs' color='fg.muted'>
                    {of(row.exportsWithFreight, row.exports)} con booking
                  </Text>
                </>
              ),
            },
          ]}
        />
      </Tabs.Content>
      <Tabs.Content value='depositos' px={0}>
        <TotalsTable
          rows={report.deposits}
          empty='Ninguna exportación con depósito en el período.'
          columns={[
            name('Depósito'),
            containersColumn(),
            exportsColumn(),
            boxesColumn(),
          ]}
        />
      </Tabs.Content>
      <Tabs.Content value='verificadoras' px={0}>
        <TotalsTable
          rows={report.verifiers}
          empty='Ninguna exportación con verificadora en el período.'
          columns={[
            name('Verificadora'),
            { ...exportsColumn(), header: 'Procesos' },
            boxesColumn(),
          ]}
        />
      </Tabs.Content>
    </Tabs.Root>
  );
}

function Report(): React.JSX.Element {
  const { values } = useFormikContext<{ from: string; to: string }>();
  const borderColor = 'border';
  const mutedColor = 'fg.muted';
  const range = counterpartRange(values.from, values.to);
  const { report, isLoading } = useCounterpartTotals(range);

  return (
    <Flex direction='column' gap={5}>
      <SimpleGrid columns={{ base: 1, sm: 2 }} gap={5}>
        <InputFieldDayDate name='from' label='Desde' />
        <InputFieldDayDate name='to' label='Hasta' />
      </SimpleGrid>
      <Text fontSize='sm' color={mutedColor}>
        Exportaciones no canceladas con fecha de corte en el período, los dos
        días incluidos.
      </Text>
      {isLoading && <LoadingState />}
      {report && (
        <>
          <SimpleGrid columns={{ base: 1, sm: 3 }} gap={4}>
            {[
              ['Exportaciones', report.totals.exports],
              ['Cajas', report.totals.boxes],
              ['Contenedores', report.totals.containers],
            ].map(([label, value]) => (
              <Stat.Root
                key={label}
                borderWidth='1px'
                borderColor={borderColor}
                borderRadius='lg'
                p={3}
              >
                <Stat.Label>{label}</Stat.Label>
                <Stat.ValueText>{value}</Stat.ValueText>
              </Stat.Root>
            ))}
          </SimpleGrid>
          <ReportTabs report={report} />
        </>
      )}
    </Flex>
  );
}

export default function CounterpartTotalsView(): React.JSX.Element {
  const initialValues = useMemo(() => {
    const today = new Date();
    return {
      from: startOfMonth(today),
      to: startOfLocalDay(today.toISOString()),
    };
  }, []);
  return (
    <Formik initialValues={initialValues} onSubmit={() => undefined}>
      <Report />
    </Formik>
  );
}
