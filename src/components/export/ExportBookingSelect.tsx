import {
  Box,
  Checkbox,
  NativeSelect,
  SimpleGrid,
  Text,
  VStack,
  Field,
} from '@chakra-ui/react';
import { useFormikContext } from 'formik';
import React from 'react';
import { ValuesProps } from './schemas/export.schema';
import { useBookings } from '../../hooks/booking/getBookings';
import { BookingResponse } from '../../types/booking';
import {
  formatDayMonthYear,
  formatDayMonthYearTime,
} from '../../utils/dayMonthYear';
import { useColorModeValue } from '../ui/color-mode';

interface ExportBookingSelectProps {
  editingExportId?: number;
}

const bookingLabel = (booking: BookingResponse): string =>
  `${booking.bookingNumber} · ${booking.shippingCompany.name} · ${booking.harborDeparture.name} → ${booking.harborDestination.name} · zarpe ${formatDayMonthYear(booking.etd)}`;

// Picking a booking fills the trip fields with its data; the backend copies
// them from the booking anyway, so what the form shows is what gets saved.
export default function ExportBookingSelect({
  editingExportId,
}: ExportBookingSelectProps): React.JSX.Element {
  const { values, setFieldValue } = useFormikContext<ValuesProps>();
  const { data } = useBookings();
  const bookings = (data ?? []) as BookingResponse[];
  const selected = bookings.find((b) => b.id === values.bookingId);
  const summaryBg = useColorModeValue('gray.50', 'gray.700');

  const choose = (id: number | ''): void => {
    const booking = bookings.find((b) => b.id === id);
    setFieldValue('bookingId', booking ? booking.id : '');
    setFieldValue('bookingContainerIds', []);
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

  const toggle = (containerId: number, checked: boolean): void => {
    const current = values.bookingContainerIds;
    setFieldValue(
      'bookingContainerIds',
      checked
        ? [...current, containerId]
        : current.filter((id) => id !== containerId)
    );
  };

  return (
    <VStack align='stretch' gap={4}>
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
          Con booking, la naviera, la ruta, la nave y el número salen de él.
        </Field.HelperText>
      </Field.Root>

      {selected && (
        <Box bg={summaryBg} borderRadius='md' p={4}>
          <SimpleGrid columns={{ base: 1, md: 2 }} gap={2} fontSize='sm'>
            <Text>
              <strong>Naviera:</strong> {selected.shippingCompany.name}
            </Text>
            <Text>
              <strong>Ruta:</strong> {selected.harborDeparture.name} →{' '}
              {selected.harborDestination.name}
            </Text>
            <Text>
              <strong>Nave:</strong> {selected.shipName}
            </Text>
            <Text>
              <strong>Zarpe (ETD):</strong>{' '}
              {formatDayMonthYearTime(selected.etd)}
            </Text>
            <Text>
              <strong>Llegada (ETA):</strong>{' '}
              {formatDayMonthYear(selected.eta) || '—'}
            </Text>
            <Text>
              <strong>Tránsito:</strong>{' '}
              {selected.transitDays ? `${selected.transitDays} días` : '—'}
            </Text>
          </SimpleGrid>

          <Text fontSize='sm' fontWeight='semibold' mt={4} mb={2}>
            Contenedores que carga esta exportación
          </Text>
          {selected.containers.length === 0 ? (
            <Text fontSize='sm' color='gray.500'>
              El booking todavía no tiene números de contenedor.
            </Text>
          ) : (
            <SimpleGrid columns={{ base: 1, md: 2 }} gap={2}>
              {selected.containers.map((container) => {
                const taken =
                  !!container.exportId &&
                  container.exportId !== editingExportId;
                return (
                  <Checkbox.Root
                    key={container.id}
                    disabled={taken}
                    onCheckedChange={(event) =>
                      toggle(container.id, event.checked === true)
                    }
                    checked={values.bookingContainerIds.includes(container.id)}
                  >
                    <Checkbox.HiddenInput />
                    <Checkbox.Control>
                      <Checkbox.Indicator />
                    </Checkbox.Control>
                    <Checkbox.Label>
                      {container.number}
                      {taken && (
                        <Text as='span' color='gray.500' fontSize='sm'>
                          {' '}
                          · en la exportación {container.exportId}
                        </Text>
                      )}
                    </Checkbox.Label>
                  </Checkbox.Root>
                );
              })}
            </SimpleGrid>
          )}
        </Box>
      )}
    </VStack>
  );
}
