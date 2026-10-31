import {
  Alert,
  Badge,
  Box,
  Button,
  Checkbox,
  Flex,
  Grid,
  IconButton,
  NativeSelect,
  SimpleGrid,
  Text,
  Field,
} from '@chakra-ui/react';
import { useQueryClient } from '@tanstack/react-query';
import { FieldArray, Form, Formik, useField, useFormikContext } from 'formik';
import { useRouter } from 'next/navigation';
import React, { useMemo } from 'react';
import { FiPlus, FiTrash2 } from 'react-icons/fi';
import * as Yup from 'yup';
import CatalogSelect from '@/components/ui/form/CatalogSelect';
import {
  FormSectionTitle,
  FormActions,
} from '@/components/ui/form/FormSection';
import { toaster } from '@/components/ui/toaster';
import { qk, QueryKeyName } from '@/lib/queryKeys';
import {
  exportPlanBody,
  planInitialValues,
  planLine,
  PlanValues,
} from './exportPlan';
import { useBookings } from '../../hooks/booking/getBookings';
import { useBusinesses } from '../../hooks/business/getAllBusiness';
import { useContractUsage } from '../../hooks/contract-usage/contractUsage';
import { useCreateExportPlan } from '../../hooks/export/createExportPlan';
import { useShippingCompanies } from '../../hooks/export/shippingCompany/getShippingCompanies';
import { BookingResponse } from '../../types/booking';
import { FarmUsage } from '../../types/contractUsage';
import { ShippingCompanyType } from '../../types/shippingCompany';
import { formatDayMonthYear } from '../../utils/dayMonthYear';
import { serverErrorMessage } from '../../utils/serverErrorMessage';
import BoxBrandSelectBase from '../box-brands/BoxBrandSelectBase';
import InputFieldClientSelect from '../client/InputFieldClientSelect';
import InputFieldDepositSelect from '../deposit/InputFieldDepositSelect';
import InputFieldHarborShippingCompany from '../shipping-company/InputFieldHarborShippingCompany';
import InputFieldShipName from '../shipping-company/InputFieldShipName';
import InputFieldShippingCompanySelect from '../shipping-company/InputFieldShippingCompanySelect';
import InputFieldTransportSelect from '../transport/InputFiledTransportSelect';
import InputFieldDayDate, {
  INVALID_DAY_DATE,
} from '../ui/form/InputFieldDayDate';
import InputFieldDayDateTime from '../ui/form/InputFieldDayDateTime';
import InputFieldPlain from '../ui/form/InputFieldPlain';
import InputFieldVerifierSelect from '../verifier/InputFieldVerifierSelect';

const AFFECTED_QUERIES: QueryKeyName[] = [
  'exports',
  'exportsPending',
  'cuttingSheets',
  'cuttingSheetsPending',
  'bookings',
  'purchaseOrderWeek',
  'priceSheet',
  'contractUsage',
  'contractUsageCheck',
  'lastFarmExport',
  'vessels',
];

const id = Yup.number().typeError('Requerido').required('Requerido');

const validationSchema = Yup.object({
  lines: Yup.array()
    .of(
      Yup.object({
        businessId: Yup.number()
          .typeError('Selecciona la finca')
          .required('Selecciona la finca'),
        boxBrandId: Yup.number()
          .typeError('Selecciona la alícuota')
          .required('Selecciona la alícuota'),
        cuttingDate: Yup.string()
          .required('Requerido')
          .notOneOf([INVALID_DAY_DATE], 'Fecha inválida, use DD/MM/AAAA'),
        boxQuantity: Yup.number()
          .typeError('Debe ser un número')
          .integer('Debe ser un número entero')
          .moreThan(0, 'Debe ser mayor que 0')
          .max(10000, 'Hasta 10000 cajas')
          .required('Requerido'),
      })
    )
    .min(1, 'Asigna al menos una finca'),
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
      .flatMap((line) => line.bookingContainerIds)
  );
  const free = booking.containers.filter((c) => !c.exportId);

  if (free.length === 0) {
    return (
      <Text fontSize='sm' color='fg.muted'>
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

function FarmContract({
  farm,
}: {
  farm: FarmUsage | undefined;
}): React.JSX.Element {
  if (!farm || farm.price === null) {
    return (
      <Badge colorPalette='orange' variant='subtle'>
        Sin contrato esa semana: va spot
      </Badge>
    );
  }
  if (farm.remainingContainers === null) {
    return (
      <Badge colorPalette='green' variant='subtle'>
        Contrato a ${farm.price}, sin tope de contenedores
      </Badge>
    );
  }
  return (
    <Badge
      colorPalette={farm.remainingContainers > 0 ? 'green' : 'orange'}
      variant='subtle'
    >
      Contrato a ${farm.price}: le quedan{' '}
      {Math.max(0, farm.remainingContainers)} de {farm.weeklyContainers}{' '}
      contenedores
    </Badge>
  );
}

function PlanLine({
  index,
  farms,
  usage,
  booking,
  canRemove,
  onRemove,
}: {
  index: number;
  farms: { id: number; name: string }[];
  usage: FarmUsage[];
  booking: BookingResponse | undefined;
  canRemove: boolean;
  onRemove: () => void;
}): React.JSX.Element {
  const prefix = `lines[${index}]`;
  const [farmField, farmMeta, farmHelpers] = useField<number | ''>(
    `${prefix}.businessId`
  );
  const [brandField, brandMeta, brandHelpers] = useField<number | ''>(
    `${prefix}.boxBrandId`
  );

  return (
    <Box borderWidth='1px' borderColor='border' borderRadius='lg' p={4}>
      <Grid
        templateColumns={{
          base: '1fr',
          md: '1fr 1fr',
          xl: '2fr 2fr 1fr 1fr auto',
        }}
        gap={4}
        alignItems='start'
      >
        <Field.Root invalid={!!farmMeta.error && farmMeta.touched}>
          <Field.Label fontSize='sm' mb='8px'>
            Finca
          </Field.Label>
          <CatalogSelect<{ id: number; name: string }>
            field={farmField}
            options={farms}
            placeholder='Selecciona la finca'
            onChange={(value) => farmHelpers.setValue(value?.id ?? '')}
          />
          <Field.ErrorText>{farmMeta.error}</Field.ErrorText>
        </Field.Root>
        <Field.Root invalid={!!brandMeta.error && brandMeta.touched}>
          <Field.Label fontSize='sm' mb='8px'>
            Alícuota
          </Field.Label>
          <BoxBrandSelectBase
            field={brandField}
            placeholder='Selecciona la alícuota'
            onChange={(value) => brandHelpers.setValue(value?.id ?? '')}
          />
          <Field.ErrorText>{brandMeta.error}</Field.ErrorText>
        </Field.Root>
        <InputFieldDayDate
          name={`${prefix}.cuttingDate`}
          label='Día de corte'
        />
        <InputFieldPlain
          name={`${prefix}.boxQuantity`}
          label='Cajas'
          unit='cajas'
          inputMode='numeric'
        />
        <IconButton
          aria-label={`Quitar la finca ${index + 1}`}
          variant='ghost'
          colorPalette='red'
          mt={{ base: 0, xl: 7 }}
          disabled={!canRemove}
          onClick={onRemove}
        >
          <FiTrash2 />
        </IconButton>
      </Grid>
      {farmField.value && (
        <Box mt={3}>
          <FarmContract
            farm={usage.find((farm) => farm.business.id === farmField.value)}
          />
        </Box>
      )}
      {booking && (
        <Box mt={3}>
          <Text fontSize='sm' fontWeight='semibold' mb={2}>
            Contenedores de esta finca
          </Text>
          <LineContainers index={index} booking={booking} />
        </Box>
      )}
    </Box>
  );
}

export default function ExportPlanForm({
  clientId,
  boxBrandId,
  pendingBoxes,
  week,
}: {
  clientId: number | '';
  boxBrandId: number | '';
  pendingBoxes?: number;
  week: string | null;
}): React.JSX.Element {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { mutate: create, isPending: isLoading } = useCreateExportPlan();
  const { data: bookingData } = useBookings();
  const bookings = (bookingData ?? []) as BookingResponse[];
  const { data: shippingCompanies = [] } = useShippingCompanies();
  const { data: farmData = [] } = useBusinesses();
  const { usage } = useContractUsage(week);
  const shippingCompanyById = (
    companyId: number | ''
  ): Partial<ShippingCompanyType> | null =>
    (shippingCompanies as Partial<ShippingCompanyType>[]).find(
      (company) => company.id === companyId
    ) ?? null;
  const farms = farmData.map((farm) => ({ id: farm.id, name: farm.name }));
  const initialValues = useMemo(
    () => planInitialValues({ clientId, boxBrandId, pendingBoxes }),
    [clientId, boxBrandId, pendingBoxes]
  );
  const back = week
    ? `/dashboard/export/weekly-plan?week=${encodeURIComponent(week)}`
    : '/dashboard/export/weekly-plan';

  const onSubmit = (values: PlanValues): void => {
    create(exportPlanBody(values), {
      onError: (error) => {
        toaster.create({
          title: 'No se creó ninguna exportación',
          description: serverErrorMessage(error),
          type: 'error',
          duration: 8000,
          closable: true,
        });
      },
      onSuccess: ({ data }) => {
        const notes = data.exports
          .map((e) => e.note)
          .filter((note): note is string => Boolean(note));
        toaster.create({
          title:
            data.exports.length === 1
              ? 'Se creó 1 exportación'
              : `Se crearon ${data.exports.length} exportaciones`,
          description: notes.length > 0 ? notes.join(' ') : undefined,
          type: notes.length > 0 ? 'warning' : 'success',
          duration: notes.length > 0 ? 10000 : 5000,
          closable: true,
        });
        AFFECTED_QUERIES.forEach((key) =>
          queryClient.invalidateQueries({ queryKey: qk(key) })
        );
        router.push(back);
      },
    });
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={onSubmit}
      enableReinitialize
    >
      {({ values, errors, setFieldValue }) => {
        const booking = bookings.find((b) => b.id === values.bookingId);
        return (
          <Form>
            <Flex direction='column' gap={3}>
              <FormSectionTitle>Cliente</FormSectionTitle>
              <SimpleGrid columns={{ base: 1, sm: 2 }} gap={5}>
                <InputFieldClientSelect
                  name='clientId'
                  label='Cliente'
                  placeholder='Selecciona el cliente'
                />
              </SimpleGrid>

              <FormSectionTitle>Fincas</FormSectionTitle>
              <Alert.Root status='info' borderRadius='md'>
                <Alert.Indicator />
                <Alert.Description fontSize='sm'>
                  Cada finca será una exportación con todas sus cajas en el día
                  de corte. Se compra de contrato mientras le queden
                  contenedores pactados esa semana, en el orden de la lista; lo
                  que pase va spot y se precia en la hoja semanal.
                </Alert.Description>
              </Alert.Root>
              <FieldArray name='lines'>
                {({ push, remove }) => (
                  <Flex direction='column' gap={3}>
                    {values.lines.map((_, index) => (
                      <PlanLine
                        key={index}
                        index={index}
                        farms={farms}
                        usage={usage?.farms ?? []}
                        booking={booking}
                        canRemove={values.lines.length > 1}
                        onRemove={() => remove(index)}
                      />
                    ))}
                    {typeof errors.lines === 'string' && (
                      <Text color='red.fg' fontSize='sm'>
                        {errors.lines}
                      </Text>
                    )}
                    <Button
                      alignSelf='flex-start'
                      variant='outline'
                      colorPalette='green'
                      onClick={() =>
                        push(planLine(values.lines[0]?.boxBrandId ?? ''))
                      }
                    >
                      <FiPlus />
                      Agregar finca
                    </Button>
                  </Flex>
                )}
              </FieldArray>

              <FormSectionTitle>Datos comunes</FormSectionTitle>
              <PlanBookingSelect bookings={bookings} />
              {!values.bookingId && (
                <>
                  <InputFieldShippingCompanySelect
                    name='shippingCompanyId'
                    label='Naviera'
                    placeholder='Selecciona una naviera'
                    onSelect={() => {
                      setFieldValue('departureHarborId', '');
                      setFieldValue('destinationHarborId', '');
                    }}
                  />
                  <SimpleGrid columns={{ base: 1, sm: 2 }} gap={5}>
                    <InputFieldHarborShippingCompany
                      key={`departure-${values.shippingCompanyId || 'none'}`}
                      name='departureHarborId'
                      label='Puerto de salida'
                      type='departure'
                      placeholder='Selecciona un puerto de salida'
                      shippingCompany={shippingCompanyById(
                        values.shippingCompanyId
                      )}
                    />
                    <InputFieldHarborShippingCompany
                      key={`destination-${values.shippingCompanyId || 'none'}`}
                      name='destinationHarborId'
                      label='Puerto de destino'
                      type='destination'
                      placeholder='Selecciona un puerto de destino'
                      shippingCompany={shippingCompanyById(
                        values.shippingCompanyId
                      )}
                    />
                  </SimpleGrid>
                  <SimpleGrid columns={{ base: 1, sm: 3 }} gap={5}>
                    <InputFieldShipName
                      name='shipName'
                      label='Nombre de la nave'
                      shippingCompanyId={values.shippingCompanyId}
                    />
                    <InputFieldPlain
                      name='estimatedTravelTime'
                      label='Tiempo estimado de viaje'
                    />
                    <InputFieldPlain
                      name='bookingNumber'
                      label='Número de booking'
                    />
                  </SimpleGrid>
                </>
              )}
              <SimpleGrid columns={{ base: 1, sm: 2 }} gap={5}>
                <InputFieldDayDateTime
                  name='shippingDateTime'
                  label='Fecha máxima de ingreso'
                />
                <InputFieldDepositSelect
                  name='depositId'
                  label='Depósito'
                  placeholder='Selecciona un deposito'
                />
                <InputFieldTransportSelect
                  name='transportId'
                  label='Transporte'
                  placeholder='Selecciona un transporte'
                />
                <InputFieldVerifierSelect
                  name='verifierId'
                  label='Verificadora'
                  placeholder='Selecciona una verificadora'
                />
                <InputFieldPlain
                  name='numberOfVerifiers'
                  label='Número de verificadores'
                  inputMode='numeric'
                />
              </SimpleGrid>

              <Text fontSize='sm' color='fg.muted' mt={2}>
                Se crean todas o ninguna: si una finca no pasa, no se guarda
                nada y el mensaje dice cuál.
              </Text>
              <FormActions>
                <Button type='submit' colorPalette='green' loading={isLoading}>
                  {values.lines.length === 1
                    ? 'Crear 1 exportación'
                    : `Crear ${values.lines.length} exportaciones`}
                </Button>
              </FormActions>
            </Flex>
          </Form>
        );
      }}
    </Formik>
  );
}
