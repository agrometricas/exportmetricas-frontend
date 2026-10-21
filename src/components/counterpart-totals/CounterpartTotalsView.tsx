import {
  Box,
  Flex,
  SimpleGrid,
  Stat,
  StatLabel,
  StatNumber,
  Tab,
  Table,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  useColorModeValue,
} from '@chakra-ui/react';
import { Formik, useFormikContext } from 'formik';
import React, { useMemo } from 'react';
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
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const mutedColor = useColorModeValue('gray.600', 'gray.400');
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
      <Table size='sm'>
        <Thead>
          <Tr>
            {columns.map((column) => (
              <Th key={column.header} isNumeric={column.numeric}>
                {column.header}
              </Th>
            ))}
          </Tr>
        </Thead>
        <Tbody>
          {rows.map((row) => (
            <Tr key={row.id}>
              {columns.map((column) => (
                <Td key={column.header} isNumeric={column.numeric}>
                  {column.value(row)}
                </Td>
              ))}
            </Tr>
          ))}
        </Tbody>
      </Table>
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
      <Text fontSize='xs' color='gray.600'>
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
    <Tabs colorScheme='green' variant='enclosed' isLazy>
      <TabList overflowX='auto' overflowY='hidden'>
        <Tab>Clientes</Tab>
        <Tab>Productores</Tab>
        <Tab>Fincas</Tab>
        <Tab>Puertos</Tab>
        <Tab>Navieras</Tab>
        <Tab>Depósitos</Tab>
        <Tab>Verificadoras</Tab>
      </TabList>
      <TabPanels>
        <TabPanel px={0}>
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
                    <Text fontSize='xs' color='gray.600'>
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
        </TabPanel>
        <TabPanel px={0}>
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
        </TabPanel>
        <TabPanel px={0}>
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
        </TabPanel>
        <TabPanel px={0}>
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
        </TabPanel>
        <TabPanel px={0}>
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
                    <Text fontSize='xs' color='gray.600'>
                      {of(row.exportsWithFreight, row.exports)} con booking
                    </Text>
                  </>
                ),
              },
            ]}
          />
        </TabPanel>
        <TabPanel px={0}>
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
        </TabPanel>
        <TabPanel px={0}>
          <TotalsTable
            rows={report.verifiers}
            empty='Ninguna exportación con verificadora en el período.'
            columns={[
              name('Verificadora'),
              { ...exportsColumn(), header: 'Procesos' },
              boxesColumn(),
            ]}
          />
        </TabPanel>
      </TabPanels>
    </Tabs>
  );
}

function Report(): React.JSX.Element {
  const { values } = useFormikContext<{ from: string; to: string }>();
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const mutedColor = useColorModeValue('gray.600', 'gray.400');
  const range = counterpartRange(values.from, values.to);
  const { report, isLoading } = useCounterpartTotals(range);

  return (
    <Flex direction='column' gap={5}>
      <SimpleGrid columns={{ base: 1, sm: 2 }} spacing={5}>
        <InputFieldDayDate name='from' label='Desde' />
        <InputFieldDayDate name='to' label='Hasta' />
      </SimpleGrid>
      <Text fontSize='sm' color={mutedColor}>
        Exportaciones no canceladas con fecha de corte en el período, los dos
        días incluidos.
      </Text>
      {isLoading && <Text>Cargando...</Text>}
      {report && (
        <>
          <SimpleGrid columns={{ base: 1, sm: 3 }} spacing={4}>
            {[
              ['Exportaciones', report.totals.exports],
              ['Cajas', report.totals.boxes],
              ['Contenedores', report.totals.containers],
            ].map(([label, value]) => (
              <Stat
                key={label}
                borderWidth='1px'
                borderColor={borderColor}
                borderRadius='lg'
                p={3}
              >
                <StatLabel>{label}</StatLabel>
                <StatNumber>{value}</StatNumber>
              </Stat>
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
