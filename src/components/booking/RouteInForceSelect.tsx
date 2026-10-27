import { Alert, Link, NativeSelect, Text, Field } from '@chakra-ui/react';
import { useFormikContext } from 'formik';
import Link_Next from 'next/link';
import React from 'react';
import { ValuesProps } from './schemas/booking.schema';
import { useRoutesInForce } from '../../hooks/shipping-contract/getRoutesInForce';
import { RouteInForce } from '../../types/booking';
import { atHourMinute, formatDayMonthYear } from '../../utils/dayMonthYear';

const routeKey = (departure: number | '', destination: number | ''): string =>
  departure && destination ? `${departure}-${destination}` : '';

// The routes offered are the ones whose contract is in force on the departure
// day; the price shown is the one the backend will freeze in the booking.
export default function RouteInForceSelect(): React.JSX.Element {
  const { values, errors, touched, setFieldValue } =
    useFormikContext<ValuesProps>();
  const day = values.etdDay || null;
  const when = (day && atHourMinute(day, values.etdTime)) || day;
  const { data, isLoading } = useRoutesInForce(values.shippingCompanyId, when);
  const routes = (data ?? []) as RouteInForce[];

  const selected = routes.find(
    (route) =>
      route.harborDeparture.id === values.harborDepartureId &&
      route.harborDestination.id === values.harborDestinationId
  );
  const invalid = !!errors.harborDepartureId && !!touched.harborDepartureId;

  if (!values.shippingCompanyId || !day) {
    return (
      <Text fontSize='sm' color='fg.muted'>
        Elija la naviera y el día de zarpe para ver las rutas con contrato
        vigente.
      </Text>
    );
  }

  if (!isLoading && routes.length === 0) {
    return (
      <Alert.Root status='warning' borderRadius='md'>
        <Alert.Indicator />
        <Alert.Description fontSize='sm'>
          Esta naviera no tiene un contrato vigente ese día.{' '}
          <Link fontWeight='semibold' textDecoration='underline' asChild>
            <Link_Next href='/dashboard/client/add-shipping-contract'>
              Regístralo en Contratos Navieros
            </Link_Next>
          </Link>
          .
        </Alert.Description>
      </Alert.Root>
    );
  }

  return (
    <Field.Root invalid={invalid}>
      <Field.Label fontSize='sm' mb='8px'>
        Ruta
      </Field.Label>
      <NativeSelect.Root>
        <NativeSelect.Field
          placeholder={isLoading ? 'Cargando rutas…' : 'Seleccione la ruta'}
          value={routeKey(values.harborDepartureId, values.harborDestinationId)}
          onChange={(event) => {
            const route = routes.find(
              (r) =>
                routeKey(r.harborDeparture.id, r.harborDestination.id) ===
                event.target.value
            );
            setFieldValue('harborDepartureId', route?.harborDeparture.id ?? '');
            setFieldValue(
              'harborDestinationId',
              route?.harborDestination.id ?? ''
            );
          }}
        >
          {routes.map((route) => (
            <option
              key={route.id}
              value={routeKey(
                route.harborDeparture.id,
                route.harborDestination.id
              )}
            >
              {route.harborDeparture.name} → {route.harborDestination.name}
            </option>
          ))}
        </NativeSelect.Field>
        <NativeSelect.Indicator />
      </NativeSelect.Root>
      <Field.ErrorText>{errors.harborDepartureId}</Field.ErrorText>
      {selected && (
        <Text fontSize='sm' color='fg.muted' mt={2}>
          ${Number(selected.costPerContainer).toFixed(2)} por contenedor
          {selected.transitDays
            ? ` · ${selected.transitDays} días de tránsito`
            : ''}{' '}
          · contrato {selected.contract.reference ?? 'sin referencia'}, vigente
          hasta el {formatDayMonthYear(selected.contract.endDate)}
        </Text>
      )}
    </Field.Root>
  );
}
