import {
  Badge,
  Box,
  Button,
  Flex,
  Heading,
  SimpleGrid,
  Text,
  useColorModeValue,
  useToast,
} from '@chakra-ui/react';
import { isAxiosError } from 'axios';
import { Form, Formik } from 'formik';
import { useRouter } from 'next/navigation';
import React from 'react';
import { useQueryClient } from 'react-query';
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
  const toast = useToast();
  const router = useRouter();
  const queryClient = useQueryClient();
  const borderColor = useColorModeValue('gray.200', 'gray.600');
  const { mutate: save, isLoading } = useUpdateContainerSeals();

  const onSubmit = (values: SealsValues): void =>
    save(
      { bookingId, containerId: container.id, body: sealsBody(values) },
      {
        onError: (error) => {
          if (isAxiosError(error) && error.response?.status === 401) {
            router.push('/api/auth/signout');
            return;
          }
          toast({
            title: `No se guardaron los sellos de ${container.number}`,
            description: serverErrorMessage(error),
            status: 'error',
            duration: 6000,
            isClosable: true,
          });
        },
        onSuccess: () => {
          toast({
            title: `Sellos de ${container.number} guardados`,
            status: 'success',
            duration: 4000,
            isClosable: true,
          });
          AFFECTED_QUERIES.forEach((key) => queryClient.invalidateQueries(key));
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
                <Badge colorScheme='green'>
                  Exportación {container.exportId}
                </Badge>
              ) : (
                <Badge>Libre</Badge>
              )}
            </Flex>
            <SimpleGrid
              columns={{ base: 1, md: 3 }}
              spacing={4}
              alignItems='end'
            >
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
                colorScheme='teal'
                variant='outline'
                isLoading={isLoading}
                isDisabled={!dirty}
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
      <Heading fontSize='2xl' p='12px'>
        Sellos de los contenedores
      </Heading>
      <Text fontSize='sm' color='gray.600'>
        El sello de la naviera y los sellos extra (verificadora, exportadora…)
        de cada contenedor. La hoja de corte y el packing list los imprimen.
      </Text>
      {containers.length === 0 ? (
        <Text fontSize='sm' color='gray.500'>
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
