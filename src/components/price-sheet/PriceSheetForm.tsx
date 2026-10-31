import {
  Alert,
  Badge,
  Box,
  Button,
  Flex,
  Link,
  SimpleGrid,
  Stat,
  Table,
  Text,
} from '@chakra-ui/react';
import { useQueryClient } from '@tanstack/react-query';
import { Form, Formik, FormikErrors, useFormikContext } from 'formik';
import Link_Next from 'next/link';
import React, { useEffect, useMemo } from 'react';
import LoadingState from '@/components/ui/states/LoadingState';
import { toaster } from '@/components/ui/toaster';
import { qk } from '@/lib/queryKeys';
import {
  priceKey,
  priceSheetBody,
  pricesFromSheet,
  PriceValues,
} from './priceSheetBody';
import {
  usePriceSheet,
  usePriceSheetQuote,
  useSavePriceSheet,
} from '../../hooks/price-sheet/priceSheet';
import { PriceSheet } from '../../types/priceSheet';
import { startOfLocalDay } from '../../utils/dayMonthYear';
import { getWeekInfo } from '../../utils/getWeekInfo';
import { isMoney } from '../../utils/money';
import { serverErrorMessage } from '../../utils/serverErrorMessage';
import { isCompleteDay } from '../purchase-order/schemas/purchaseOrder.schema';
import InputFieldDayDate from '../ui/form/InputFieldDayDate';
import InputFieldPlain from '../ui/form/InputFieldPlain';

interface Values {
  weekDay: string;
  prices: PriceValues;
}

const usd = (value: string): string => `$${value}`;

function validate(values: Values): FormikErrors<Values> {
  const prices = Object.fromEntries(
    Object.entries(values.prices)
      .filter(([, text]) => text.trim() && !isMoney(text))
      .map(([key]) => [key, 'Monto inválido'])
  );
  return Object.keys(prices).length ? { prices } : {};
}

function SheetTable({ sheet }: { sheet: PriceSheet }): React.JSX.Element {
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
            <Table.ColumnHeader>Alícuota</Table.ColumnHeader>
            <Table.ColumnHeader>Cliente</Table.ColumnHeader>
            <Table.ColumnHeader>Tipo</Table.ColumnHeader>
            <Table.ColumnHeader textAlign='end'>Cajas</Table.ColumnHeader>
            <Table.ColumnHeader>Precio por caja</Table.ColumnHeader>
            <Table.ColumnHeader textAlign='end'>Total</Table.ColumnHeader>
            <Table.ColumnHeader>Exportación</Table.ColumnHeader>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {sheet.lines.map((line) => (
            <Table.Row key={line.exportId}>
              <Table.Cell>{line.merchant.businessName}</Table.Cell>
              <Table.Cell>{line.business.name}</Table.Cell>
              <Table.Cell>{line.boxBrand.name}</Table.Cell>
              <Table.Cell>{line.client.businessName}</Table.Cell>
              <Table.Cell>
                <Badge
                  colorPalette={line.type === 'CONTRACT' ? 'green' : 'purple'}
                  variant='subtle'
                >
                  {line.type === 'CONTRACT' ? 'Contrato' : 'Spot'}
                </Badge>
              </Table.Cell>
              <Table.Cell textAlign='end'>{line.boxQuantity}</Table.Cell>
              <Table.Cell minW='150px'>
                {line.editable ? (
                  <InputFieldPlain
                    name={`prices.${priceKey(line.exportId)}`}
                    inputMode='decimal'
                    placeholder={line.proposedPrice}
                  />
                ) : (
                  <Text fontSize='sm'>
                    {line.price ? usd(line.price) : '—'}
                    <Text as='span' color={mutedColor}>
                      {' '}
                      · del contrato
                    </Text>
                  </Text>
                )}
                {line.belowMinimum && (
                  <Badge colorPalette='red' variant='subtle' mt={1}>
                    Bajo el mínimo
                  </Badge>
                )}
              </Table.Cell>
              <Table.Cell fontWeight='semibold' textAlign='end'>
                {usd(line.total)}
              </Table.Cell>
              <Table.Cell>
                <Text fontSize='sm'>
                  <Link color='green.fg' asChild>
                    <Link_Next href={`/dashboard/export/${line.exportId}`}>
                      {line.exportId}
                    </Link_Next>
                  </Link>
                  {line.paidPrice && (
                    <Text as='span' color={mutedColor}>
                      {' '}
                      · pagada a {usd(line.paidPrice)}
                    </Text>
                  )}
                </Text>
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
        <Table.Footer>
          <Table.Row>
            <Table.ColumnHeader colSpan={5}>
              Total de la semana
            </Table.ColumnHeader>
            <Table.ColumnHeader textAlign='end'>
              {sheet.totals.boxes}
            </Table.ColumnHeader>
            <Table.ColumnHeader />
            <Table.ColumnHeader textAlign='end'>
              {usd(sheet.totals.amount)}
            </Table.ColumnHeader>
            <Table.ColumnHeader />
          </Table.Row>
        </Table.Footer>
      </Table.Root>
    </Box>
  );
}

function SheetBody({ isSaving }: { isSaving: boolean }): React.JSX.Element {
  const { values, setFieldValue } = useFormikContext<Values>();
  const mutedColor = 'fg.muted';
  const borderColor = 'border';
  const week = isCompleteDay(values.weekDay) ? values.weekDay : null;
  const { sheet, isLoading } = usePriceSheet(week);
  const { quote, isSettled } = usePriceSheetQuote(
    priceSheetBody(values.weekDay, sheet, values.prices)
  );

  useEffect(() => {
    if (sheet) setFieldValue('prices', pricesFromSheet(sheet));
  }, [sheet, setFieldValue]);

  const shown =
    quote && sheet && quote.weekStart === sheet.weekStart ? quote : sheet;

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
        {shown && (
          <Box
            borderWidth='1px'
            borderColor={borderColor}
            borderRadius='lg'
            p={3}
          >
            <Text fontSize='sm' fontWeight='semibold'>
              Precio mínimo: FAS {usd(shown.minimum.fasBoxPrice)} · FOB{' '}
              {usd(shown.minimum.fobBoxPrice)}
            </Text>
            <Text fontSize='xs' color={mutedColor}>
              Las de contrato llevan el precio del contrato de su finca. Una
              spot sin precio usa el mínimo del contrato de su productor.{' '}
              {shown.minimum.isDefault && 'Es el de 2026: '}
              <Link color='green.fg' asChild>
                <Link_Next href='/dashboard/settings/minimum-box-price'>
                  cámbialo en Configuraciones
                </Link_Next>
              </Link>
              .
            </Text>
          </Box>
        )}
      </SimpleGrid>

      {isLoading && <LoadingState />}
      {shown && shown.lines.length === 0 && (
        <Text fontSize='sm' color={mutedColor}>
          No hay exportaciones con corte esa semana.{' '}
          <Link color='green.fg' asChild>
            <Link_Next href='/dashboard/export/weekly-plan'>
              Ver los pedidos de la semana
            </Link_Next>
          </Link>
        </Text>
      )}
      {shown && shown.lines.length > 0 && (
        <>
          <SimpleGrid columns={{ base: 1, sm: 3 }} gap={4}>
            <Stat.Root
              borderWidth='1px'
              borderColor={borderColor}
              borderRadius='lg'
              p={3}
            >
              <Stat.Label>Cajas de contrato</Stat.Label>
              <Stat.ValueText>{shown.totals.contractBoxes}</Stat.ValueText>
            </Stat.Root>
            <Stat.Root
              borderWidth='1px'
              borderColor={borderColor}
              borderRadius='lg'
              p={3}
            >
              <Stat.Label>Cajas spot</Stat.Label>
              <Stat.ValueText>{shown.totals.spotBoxes}</Stat.ValueText>
            </Stat.Root>
            <Stat.Root
              borderWidth='1px'
              borderColor={borderColor}
              borderRadius='lg'
              p={3}
            >
              <Stat.Label>Total de la semana</Stat.Label>
              <Stat.ValueText>{usd(shown.totals.amount)}</Stat.ValueText>
            </Stat.Root>
          </SimpleGrid>
          <SheetTable sheet={shown} />
          {shown.warnings.map((warning) => (
            <Alert.Root key={warning} status='warning' borderRadius='lg'>
              <Alert.Indicator />
              <Alert.Description fontSize='sm'>{warning}</Alert.Description>
            </Alert.Root>
          ))}
          <Button
            type='submit'
            colorPalette='green'
            loading={isSaving}
            disabled={!isSettled}
          >
            Guardar precios
          </Button>
        </>
      )}
    </Flex>
  );
}

export default function PriceSheetForm(): React.JSX.Element {
  const queryClient = useQueryClient();
  const { mutate: save, isPending: isSaving } = useSavePriceSheet();
  const initialValues = useMemo(
    () => ({
      weekDay: startOfLocalDay(new Date().toISOString()),
      prices: {},
    }),
    []
  );

  const onSubmit = (values: Values): void => {
    const sheet = queryClient.getQueryData<PriceSheet>([
      'priceSheet',
      values.weekDay,
    ]);
    const body = priceSheetBody(values.weekDay, sheet, values.prices);
    if (!body) return;
    save(body, {
      onError: (error) => {
        toaster.create({
          title: 'No se pudieron guardar los precios',
          description: serverErrorMessage(error),
          type: 'error',
          duration: 6000,
          closable: true,
        });
      },
      onSuccess: () => {
        toaster.create({
          title: 'Precios guardados',
          type: 'success',
          duration: 5000,
          closable: true,
        });
        queryClient.invalidateQueries({
          queryKey: qk('priceSheet'),
        });
        queryClient.invalidateQueries({
          queryKey: qk('priceSheetQuote'),
        });
        queryClient.invalidateQueries({
          queryKey: qk('purchaseOrder'),
        });
        queryClient.invalidateQueries({
          queryKey: qk('export/producer-payment/quote'),
        });
      },
    });
  };

  return (
    <Formik
      initialValues={initialValues}
      onSubmit={onSubmit}
      validate={validate}
    >
      <Form>
        <SheetBody isSaving={isSaving} />
      </Form>
    </Formik>
  );
}
