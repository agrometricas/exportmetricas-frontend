import { Badge, Box, Button, Flex, SimpleGrid, Text } from '@chakra-ui/react';
import { useQueryClient } from '@tanstack/react-query';
import { isAxiosError } from 'axios';
import { Form, Formik } from 'formik';
import { useRouter } from 'next/navigation';
import React from 'react';
import { FormSectionTitle } from '@/components/ui/form/FormSection';
import { toaster } from '@/components/ui/toaster';
import { useUpdateContainerSeals } from '../../hooks/booking/mutateBooking';
import { BookingContainer } from '../../types/booking';
import {
  sealsBody,
  sealsValues,
  SealsValues,
} from '../../utils/containerSeals';
import { serverErrorMessage } from '../../utils/serverErrorMessage';
import InputFieldPlain from '../ui/form/InputFieldPlain';

const AFFECTED_QUERIES = ['booking', 'bookings', 'exports', 'export'];

function ContainerSealsRow({
  bookingId,
  container,
}: {
  bookingId: number;
  container: BookingContainer;
}): React.JSX.Element {
  const router = useRouter();
  const queryClient = useQueryClient();
  const borderColor = 'border';
  const { mutate: save, isPending: isLoading } = useUpdateContainerSeals();

  const onSubmit = (values: SealsValues): void =>
    save(
      { bookingId, containerId: container.id, body: sealsBody(values) },
      {
        onError: (error) => {
          if (isAxiosError(error) && error.response?.status === 401) {
            router.push('/api/auth/signout');
            return;
          }
          toaster.create({
            title: `No se guardaron los sellos de ${container.number}`,
            description: serverErrorMessage(error),
            type: 'error',
            duration: 6000,
            closable: true,
          });
        },
        onSuccess: () => {
          toaster.create({
            title: `Sellos de ${container.number} guardados`,
            type: 'success',
            duration: 4000,
            closable: true,
          });
          AFFECTED_QUERIES.forEach((key) =>
            queryClient.invalidateQueries({ queryKey: [key] })
          );
        },
      }
    );

  return (
    <Formik
      initialValues={sealsValues(container)}
      onSubmit={onSubmit}
      enableReinitialize
    >
      {({ dirty }) => (
        <Form>
          <Box
            borderWidth='1px'
            borderColor={borderColor}
            borderRadius='lg'
            p={4}
          >
            <Flex gap={3} align='center' wrap='wrap' mb={3}>
              <Text fontWeight='semibold'>{container.number}</Text>
              {container.exportId ? (
                <Badge colorPalette='green'>
                  Exportación {container.exportId}
                </Badge>
              ) : (
                <Badge>Libre</Badge>
              )}
            </Flex>
            <SimpleGrid columns={{ base: 1, md: 3 }} gap={4} alignItems='end'>
              <InputFieldPlain
                name='shippingLineSeal'
                label='Sello de la naviera'
              />
              <InputFieldPlain
                name='extraSeals'
                label='Sellos extra (separados por coma)'
              />
              <Button
                type='submit'
                colorPalette='green'
                variant='outline'
                loading={isLoading}
                disabled={!dirty}
              >
                Guardar sellos
              </Button>
            </SimpleGrid>
          </Box>
        </Form>
      )}
    </Formik>
  );
}

export default function BookingContainerSeals({
  bookingId,
  containers,
}: {
  bookingId: number;
  containers: BookingContainer[];
}): React.JSX.Element {
  return (
    <Flex direction='column' gap={3}>
      <FormSectionTitle>Sellos de los contenedores</FormSectionTitle>
      <Text fontSize='sm' color='fg.muted'>
        El sello de la naviera y los sellos extra (verificadora, exportadora…)
        de cada contenedor. La hoja de corte y el packing list los imprimen.
      </Text>
      {containers.length === 0 ? (
        <Text fontSize='sm' color='fg.muted'>
          El booking todavía no tiene números de contenedor.
        </Text>
      ) : (
        containers.map((container) => (
          <ContainerSealsRow
            key={container.id}
            bookingId={bookingId}
            container={container}
          />
        ))
      )}
    </Flex>
  );
}
