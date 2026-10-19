import {
  Alert,
  AlertDescription,
  AlertIcon,
  Badge,
  Box,
  Button,
  Flex,
  Link,
  SimpleGrid,
  Stat,
  StatLabel,
  StatNumber,
  Table,
  Tbody,
  Td,
  Text,
  Tfoot,
  Th,
  Thead,
  Tr,
  useColorModeValue,
  useToast,
} from '@chakra-ui/react';
import { isAxiosError } from 'axios';
import { Form, Formik, FormikErrors, useFormikContext } from 'formik';
import Link_Next from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useEffect, useMemo } from 'react';
import { useQueryClient } from 'react-query';
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
            <Th>Alícuota</Th>
            <Th>Tipo</Th>
            <Th isNumeric>Cajas</Th>
            <Th>Precio por caja</Th>
            <Th isNumeric>Total</Th>
            <Th>Exportación</Th>
          </Tr>
        </Thead>
        <Tbody>
          {sheet.lines.map((line) => (
            <Tr key={line.lineId}>
              <Td>{line.merchant.businessName}</Td>
              <Td>{line.business.name}</Td>
              <Td>{line.boxBrand.name}</Td>
              <Td>
                <Badge
                  colorScheme={line.type === 'CONTRACT' ? 'green' : 'purple'}
                  variant='subtle'
                >
                  {line.type === 'CONTRACT' ? 'Contrato' : 'Spot'}
                </Badge>
              </Td>
              <Td isNumeric>{line.boxQuantity}</Td>
              <Td minW='150px'>
                <InputFieldPlain
                  name={`prices.${priceKey(line.lineId)}`}
                  inputMode='decimal'
                  placeholder={line.proposedPrice}
                />
                {line.belowMinimum && (
                  <Badge colorScheme='red' variant='subtle' mt={1}>
                    Bajo el mínimo
                  </Badge>
                )}
              </Td>
              <Td isNumeric fontWeight='semibold'>
                {usd(line.total)}
              </Td>
              <Td>
                {line.export ? (
                  <Text fontSize='sm'>
                    {line.export.id}
                    {line.export.paidPrice && (
                      <Text as='span' color={mutedColor}>
                        {' '}
                        · pagada a {usd(line.export.paidPrice)}
                      </Text>
                    )}
                  </Text>
                ) : (
                  <Text fontSize='sm' color={mutedColor}>
                    —
                  </Text>
                )}
              </Td>
            </Tr>
          ))}
        </Tbody>
        <Tfoot>
          <Tr>
            <Th colSpan={4}>Total de la semana</Th>
            <Th isNumeric>{sheet.totals.boxes}</Th>
            <Th />
            <Th isNumeric>{usd(sheet.totals.amount)}</Th>
            <Th />
          </Tr>
        </Tfoot>
      </Table>
    </Box>
  );
}

function SheetBody({ isSaving }: { isSaving: boolean }): React.JSX.Element {
  const { values, setFieldValue } = useFormikContext<Values>();
  const mutedColor = useColorModeValue('gray.600', 'gray.400');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
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
      <SimpleGrid columns={{ base: 1, md: 2 }} spacing={5}>
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
              Una línea sin precio usa el mínimo del contrato de su productor.{' '}
              {shown.minimum.isDefault && 'Es el de 2026: '}
              <Link
                as={Link_Next}
                href='/dashboard/settings/minimum-box-price'
                color='green.600'
              >
                cámbialo en Configuraciones
              </Link>
              .
            </Text>
          </Box>
        )}
      </SimpleGrid>

      {isLoading && <Text>Cargando...</Text>}
      {shown && shown.lines.length === 0 && (
        <Text fontSize='sm' color={mutedColor}>
          No hay órdenes de compra esa semana.{' '}
          <Link
            as={Link_Next}
            href='/dashboard/export/add-purchase-order'
            color='green.600'
          >
            Crear una orden
          </Link>
        </Text>
      )}
      {shown && shown.lines.length > 0 && (
        <>
          <SimpleGrid columns={{ base: 1, sm: 3 }} spacing={4}>
            <Stat
              borderWidth='1px'
              borderColor={borderColor}
              borderRadius='lg'
              p={3}
            >
              <StatLabel>Cajas de contrato</StatLabel>
              <StatNumber>{shown.totals.contractBoxes}</StatNumber>
            </Stat>
            <Stat
              borderWidth='1px'
              borderColor={borderColor}
              borderRadius='lg'
              p={3}
            >
              <StatLabel>Cajas spot</StatLabel>
              <StatNumber>{shown.totals.spotBoxes}</StatNumber>
            </Stat>
            <Stat
              borderWidth='1px'
              borderColor={borderColor}
              borderRadius='lg'
              p={3}
            >
              <StatLabel>Total de la semana</StatLabel>
              <StatNumber>{usd(shown.totals.amount)}</StatNumber>
            </Stat>
          </SimpleGrid>
          <SheetTable sheet={shown} />
          {shown.warnings.map((warning) => (
            <Alert key={warning} status='warning' borderRadius='lg'>
              <AlertIcon />
              <AlertDescription fontSize='sm'>{warning}</AlertDescription>
            </Alert>
          ))}
          <Button
            type='submit'
            colorScheme='teal'
            isLoading={isSaving}
            isDisabled={!isSettled}
          >
            Guardar Precios
          </Button>
        </>
      )}
    </Flex>
  );
}

export default function PriceSheetForm(): React.JSX.Element {
  const toast = useToast();
  const router = useRouter();
  const queryClient = useQueryClient();
  const { mutate: save, isLoading: isSaving } = useSavePriceSheet();
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
        if (isAxiosError(error) && error.response?.status === 401) {
          router.push('/api/auth/signout');
          return;
        }
        toast({
          title: 'No se pudieron guardar los precios',
          description: serverErrorMessage(error),
          status: 'error',
          duration: 6000,
          isClosable: true,
        });
      },
      onSuccess: () => {
        toast({
          title: 'Precios guardados',
          status: 'success',
          duration: 5000,
          isClosable: true,
        });
        queryClient.invalidateQueries('priceSheet');
        queryClient.invalidateQueries('priceSheetQuote');
        queryClient.invalidateQueries('purchaseOrder');
        queryClient.invalidateQueries('export/producer-payment/quote');
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
