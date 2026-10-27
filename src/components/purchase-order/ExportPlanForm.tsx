import {
  Badge,
  Box,
  Button,
  Checkbox,
  Flex,
  Heading,
  NativeSelect,
  SimpleGrid,
  Text,
  Separator,
  Field,
} from '@chakra-ui/react';
import { isAxiosError } from 'axios';
import { Form, Formik, useFormikContext } from 'formik';
import { useRouter } from 'next/navigation';
import React, { useMemo } from 'react';
import { useQueryClient } from 'react-query';
import * as Yup from 'yup';
import { toaster } from '@/components/ui/toaster';
import {
  exportPlanBody,
  pendingLines,
  planInitialValues,
  PlanValues,
} from './exportPlan';
import { useBookings } from '../../hooks/booking/getBookings';
import { useCreateExportPlan } from '../../hooks/export/createExportPlan';
import { useShippingCompanies } from '../../hooks/export/shippingCompany/getShippingCompanies';
import { usePagination } from '../../hooks/usePagination';
import { BookingResponse } from '../../types/booking';
import { PurchaseOrderResponse } from '../../types/purchaseOrder';
import { ShippingCompanyType } from '../../types/shippingCompany';
import { formatDayMonthYear } from '../../utils/dayMonthYear';
import { serverErrorMessage } from '../../utils/serverErrorMessage';
import SelectClient from '../client/SelectClient';
import InputFieldDepositSelect from '../deposit/InputFieldDepositSelect';
import InputFieldHarborShippingCompany from '../shipping-company/InputFieldHarborShippingCompany';
import InputFieldShipName from '../shipping-company/InputFieldShipName';
import InputFieldShippingCompanySelect from '../shipping-company/InputFieldShippingCompanySelect';
import InputFieldTransportSelect from '../transport/InputFiledTransportSelect';
import { useColorModeValue } from '../ui/color-mode';
import InputFieldDayDate, {
  INVALID_DAY_DATE,
} from '../ui/form/InputFieldDayDate';
import InputFieldDayDateTime from '../ui/form/InputFieldDayDateTime';
import InputFieldPlain from '../ui/form/InputFieldPlain';
import InputFieldVerifierSelect from '../verifier/InputFieldVerifierSelect';

const AFFECTED_QUERIES = [
  'exports',
  'exportsPending',
  'cuttingSheets',
  'cuttingSheetsPending',
  'bookings',
  'purchaseOrders',
  'purchaseOrder',
  'contractUsage',
  'contractUsageCheck',
  'vessels',
];

const id = Yup.number().typeError('Requerido').required('Requerido');

const validationSchema = Yup.object({
  lines: Yup.array()
    .of(
      Yup.object({
        include: Yup.boolean(),
        cuttingDate: Yup.string().when('include', {
          is: true,
          then: (schema) =>
            schema
              .required('Requerido')
              .notOneOf([INVALID_DAY_DATE], 'Fecha inválida, use DD/MM/AAAA'),
        }),
        boxQuantity: Yup.number().when('include', {
          is: true,
          then: (schema) =>
            schema
              .typeError('Debe ser un número')
              .integer('Debe ser un número entero')
              .moreThan(0, 'Debe ser mayor que 0')
              .max(10000, 'Hasta 10000 cajas')
              .required('Requerido'),
        }),
      })
    )
    .test('alguna', 'Elige al menos una línea', (lines) =>
      (lines ?? []).some((line) => line.include)
    ),
  clientId: id,
  departureHarborId: id,
  destinationHarborId: id,
  shipName: Yup.string().trim().required('Requerido'),
  shippingDateTime: Yup.string()
    .required('Requerido')
    .notOneOf([INVALID_DAY_DATE], 'Fecha y hora inválidas'),
});

const bookingLabel = (booking: BookingResponse): string =>
  `${booking.bookingNumber} · ${booking.shippingCompany.name} · ${booking.harborDeparture.name} → ${booking.harborDestination.name} · zarpe ${formatDayMonthYear(booking.etd)}`;

function PlanBookingSelect({
  bookings,
}: {
  bookings: BookingResponse[];
}): React.JSX.Element {
  const { values, setFieldValue } = useFormikContext<PlanValues>();

  const choose = (bookingId: number | ''): void => {
    const booking = bookings.find((b) => b.id === bookingId);
    setFieldValue('bookingId', booking ? booking.id : '');
    values.lines.forEach((_, index) =>
      setFieldValue(`lines[${index}].bookingContainerIds`, [])
    );
    if (!booking) return;
    setFieldValue('shippingCompanyId', booking.shippingCompany.id);
    setFieldValue('departureHarborId', booking.harborDeparture.id);
    setFieldValue('destinationHarborId', booking.harborDestination.id);
    setFieldValue('shipName', booking.shipName);
    setFieldValue('bookingNumber', booking.bookingNumber);
    setFieldValue(
      'estimatedTravelTime',
      booking.transitDays ? `${booking.transitDays} días` : ''
    );
  };

  return (
    <Field.Root>
      <Field.Label fontSize='sm' mb='8px'>
        Booking (opcional)
      </Field.Label>
      <NativeSelect.Root>
        <NativeSelect.Field
          placeholder='Sin booking: llenar la naviera y la nave a mano'
          value={values.bookingId}
          onChange={(event) =>
            choose(event.target.value ? Number(event.target.value) : '')
          }
        >
          {bookings.map((booking) => (
            <option key={booking.id} value={booking.id}>
              {bookingLabel(booking)}
            </option>
          ))}
        </NativeSelect.Field>
        <NativeSelect.Indicator />
      </NativeSelect.Root>
      <Field.HelperText>
        Con booking, la naviera, la ruta, la nave y el número salen de él, y
        cada línea elige sus contenedores.
      </Field.HelperText>
    </Field.Root>
  );
}

function LineContainers({
  index,
  booking,
}: {
  index: number;
  booking: BookingResponse;
}): React.JSX.Element {
  const { values, setFieldValue } = useFormikContext<PlanValues>();
  const own = values.lines[index].bookingContainerIds;
  const elsewhere = new Set(
    values.lines
      .filter((_, i) => i !== index)
      .flatMap((line) => (line.include ? line.bookingContainerIds : []))
  );
  const free = booking.containers.filter((c) => !c.exportId);

  if (free.length === 0) {
    return (
      <Text fontSize='sm' color='gray.500'>
        El booking no tiene contenedores libres.
      </Text>
    );
  }
  return (
    <Flex gap={4} wrap='wrap'>
      {free.map((container) => (
        <Checkbox.Root
          key={container.id}
          disabled={elsewhere.has(container.id)}
          onCheckedChange={(event) =>
            setFieldValue(
              `lines[${index}].bookingContainerIds`,
              event.checked === true
                ? [...own, container.id]
                : own.filter((c) => c !== container.id)
            )
          }
          checked={own.includes(container.id)}
        >
          <Checkbox.HiddenInput />
          <Checkbox.Control>
            <Checkbox.Indicator />
          </Checkbox.Control>
          <Checkbox.Label>{container.number}</Checkbox.Label>
        </Checkbox.Root>
      ))}
    </Flex>
  );
}

export default function ExportPlanForm({
  order,
}: {
  order: PurchaseOrderResponse;
}): React.JSX.Element {
  const router = useRouter();
  const queryClient = useQueryClient();
  const lineBorder = useColorModeValue('gray.200', 'gray.600');
  const { mutate: create, isLoading } = useCreateExportPlan();
  const { data: bookingData } = useBookings();
  const bookings = (bookingData ?? []) as BookingResponse[];
  const { paginationParams } = usePagination();
  const { data: shippingCompanies = [] } =
    useShippingCompanies(paginationParams);
  const shippingCompanyById = (
    companyId: number | ''
  ): Partial<ShippingCompanyType> | null =>
    (shippingCompanies as Partial<ShippingCompanyType>[]).find(
      (company) => company.id === companyId
    ) ?? null;
  const lines = pendingLines(order.lines);
  const initialValues = useMemo(
    () => planInitialValues(order.lines),
    [order.lines]
  );

  if (lines.length === 0) {
    return (
      <Text>
        Todas las líneas de esta orden ya son exportación: no queda nada que
        planificar.
      </Text>
    );
  }

  const onSubmit = (values: PlanValues): void => {
    create(exportPlanBody(order.id, values), {
      onError: (error) => {
        if (isAxiosError(error) && error.response?.status === 401) {
          router.push('/api/auth/signout');
          return;
        }
        toaster.create({
          title: 'No se creó ninguna exportación',
          description: serverErrorMessage(error),
          type: 'error',
          duration: 8000,
          closable: true,
        });
      },
      onSuccess: ({ data }) => {
        toaster.create({
          title: `Se crearon ${data.exports.length} exportaciones`,
          type: 'success',
          duration: 5000,
          closable: true,
        });
        AFFECTED_QUERIES.forEach((key) => queryClient.invalidateQueries(key));
        router.push(`/dashboard/export/purchase-orders/${order.id}`);
      },
    });
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={onSubmit}
    >
      {({ values, errors, setFieldValue }) => {
        const booking = bookings.find((b) => b.id === values.bookingId);
        const included = values.lines.filter((line) => line.include).length;
        return (
          <Form>
            <Flex direction='column' gap={3}>
              <Heading fontSize='2xl' p='12px'>
                Líneas
              </Heading>
              <Separator mb='16px' />
              <Text fontSize='sm' color='gray.600'>
                Cada línea marcada será una exportación con todas sus cajas en
                el día de corte. El día tiene que ser de la semana de la orden.
              </Text>
              {lines.map((line, index) => (
                <Box
                  key={line.id}
                  borderWidth='1px'
                  borderColor={lineBorder}
                  borderRadius='lg'
                  p={4}
                >
                  <Flex gap={3} align='center' wrap='wrap' mb={3}>
                    <Checkbox.Root
                      colorPalette='green'
                      onCheckedChange={(event) =>
                        setFieldValue(
                          `lines[${index}].include`,
                          event.checked === true
                        )
                      }
                      checked={values.lines[index].include}
                    >
                      <Checkbox.HiddenInput />
                      <Checkbox.Control>
                        <Checkbox.Indicator />
                      </Checkbox.Control>
                      <Checkbox.Label>
                        {line.business.name}· {line.boxBrand.name}
                      </Checkbox.Label>
                    </Checkbox.Root>
                    <Badge
                      colorPalette={
                        line.type === 'CONTRACT' ? 'green' : 'orange'
                      }
                    >
                      {line.type === 'CONTRACT' ? 'Contrato' : 'Spot'}
                    </Badge>
                    <Text fontSize='sm' color='gray.600'>
                      Pedidas: {line.boxQuantity} cajas
                    </Text>
                  </Flex>
                  {values.lines[index].include && (
                    <Flex direction='column' gap={3}>
                      <SimpleGrid columns={{ base: 1, sm: 2 }} gap={4}>
                        <InputFieldDayDate
                          name={`lines[${index}].cuttingDate`}
                          label='Día de Corte'
                        />
                        <InputFieldPlain
                          name={`lines[${index}].boxQuantity`}
                          label='Cajas'
                          unit='cajas'
                          inputMode='numeric'
                        />
                      </SimpleGrid>
                      {booking && (
                        <Box>
                          <Text fontSize='sm' fontWeight='semibold' mb={2}>
                            Contenedores de esta línea
                          </Text>
                          <LineContainers index={index} booking={booking} />
                        </Box>
                      )}
                    </Flex>
                  )}
                </Box>
              ))}
              {typeof errors.lines === 'string' && (
                <Text color='red.500' fontSize='sm'>
                  {errors.lines}
                </Text>
              )}

              <Heading fontSize='2xl' p='12px'>
                Datos Comunes
              </Heading>
              <Separator mb='16px' />
              <SelectClient name='clientId' />
              <PlanBookingSelect bookings={bookings} />
              {!values.bookingId && (
                <>
                  <InputFieldShippingCompanySelect
                    name='shippingCompanyId'
                    label='Naviera'
                    placeholder='Seleccione una Naviera'
                    onSelect={() => {
                      setFieldValue('departureHarborId', '');
                      setFieldValue('destinationHarborId', '');
                    }}
                  />
                  <SimpleGrid columns={{ base: 1, sm: 2 }} gap={5}>
                    <InputFieldHarborShippingCompany
                      key={`departure-${values.shippingCompanyId || 'none'}`}
                      name='departureHarborId'
                      label='Puerto de Salida'
                      type='departure'
                      placeholder='Selecciona un puerto de Salida'
                      shippingCompany={shippingCompanyById(
                        values.shippingCompanyId
                      )}
                    />
                    <InputFieldHarborShippingCompany
                      key={`destination-${values.shippingCompanyId || 'none'}`}
                      name='destinationHarborId'
                      label='Puerto de Destino'
                      type='destination'
                      placeholder='Selecciona un puerto de Destino'
                      shippingCompany={shippingCompanyById(
                        values.shippingCompanyId
                      )}
                    />
                  </SimpleGrid>
                  <SimpleGrid columns={{ base: 1, sm: 3 }} gap={5}>
                    <InputFieldShipName
                      name='shipName'
                      label='Nombre de la Nave'
                      shippingCompanyId={values.shippingCompanyId}
                    />
                    <InputFieldPlain
                      name='estimatedTravelTime'
                      label='Tiempo estimado de viaje'
                    />
                    <InputFieldPlain
                      name='bookingNumber'
                      label='Número de Booking'
                    />
                  </SimpleGrid>
                </>
              )}
              <SimpleGrid columns={{ base: 1, sm: 2 }} gap={5}>
                <InputFieldDayDateTime
                  name='shippingDateTime'
                  label='Fecha Máxima de Ingreso'
                />
                <InputFieldDepositSelect
                  name='depositId'
                  label='Depósito'
                  placeholder='Selecciona un Deposito'
                />
                <InputFieldTransportSelect
                  name='transportId'
                  label='Transporte'
                  placeholder='Selecciona un Transporte'
                />
                <InputFieldVerifierSelect
                  name='verifierId'
                  label='Verificadora'
                  placeholder='Selecciona una Verificadora'
                />
                <InputFieldPlain
                  name='numberOfVerifiers'
                  label='Número de Verificadores'
                  inputMode='numeric'
                />
              </SimpleGrid>

              <Text fontSize='sm' color='gray.600' mt={2}>
                Se crean todas o ninguna: si una línea no pasa, no se guarda
                nada y el mensaje dice cuál.
              </Text>
              <Button
                mt='12px'
                type='submit'
                colorPalette='green'
                loading={isLoading}
                disabled={included === 0}
              >
                {included === 1
                  ? 'Crear 1 exportación'
                  : `Crear ${included} exportaciones`}
              </Button>
            </Flex>
          </Form>
        );
      }}
    </Formik>
  );
}
