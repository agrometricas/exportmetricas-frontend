import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Button,
  Divider,
  Flex,
  Heading,
  HStack,
  IconButton,
  SimpleGrid,
  Text,
  useDisclosure,
} from '@chakra-ui/react';
import { FieldArray, Form, Formik } from 'formik';
import React, { useRef } from 'react';
import { FiPlus, FiTrash2 } from 'react-icons/fi';
import { useSubmitBooking } from './hooks/useSubmitBooking';
import RouteInForceSelect from './RouteInForceSelect';
import { BookingResponse } from '../../types/booking';
import InputFieldShipName from '../shipping-company/InputFieldShipName';
import InputFieldShippingCompanySelect from '../shipping-company/InputFieldShippingCompanySelect';
import InputFieldDayDate from '../ui/form/InputFieldDayDate';
import InputFieldPlain from '../ui/form/InputFieldPlain';

export default function BookingForm({
  booking,
}: {
  booking?: BookingResponse;
}): React.JSX.Element {
  const {
    onSubmit,
    onDelete,
    initialValues,
    validationSchema,
    isLoading,
    isDeleting,
  } = useSubmitBooking(booking);
  const confirm = useDisclosure();
  const cancelRef = useRef<HTMLButtonElement>(null);

  return (
    <Formik
      initialValues={initialValues}
      onSubmit={onSubmit}
      validationSchema={validationSchema}
      enableReinitialize
    >
      {({ values, errors, setFieldValue }) => (
        <Form>
          <Flex flexDirection='column' gap={3}>
            <Heading fontSize='2xl' p='12px'>
              Reserva
            </Heading>
            <Divider mb='16px' />
            <SimpleGrid columns={{ base: 1, sm: 2 }} spacing={5}>
              <InputFieldPlain name='bookingNumber' label='Número de Booking' />
              <InputFieldShippingCompanySelect
                name='shippingCompanyId'
                label='Naviera'
                placeholder='Seleccione la naviera'
                onSelect={() => {
                  setFieldValue('harborDepartureId', '');
                  setFieldValue('harborDestinationId', '');
                }}
              />
              <InputFieldShipName
                name='shipName'
                label='Nave'
                shippingCompanyId={values.shippingCompanyId}
              />
            </SimpleGrid>

            <Heading fontSize='2xl' p='16px'>
              Zarpe y Ruta
            </Heading>
            <Divider mb='16px' />
            <SimpleGrid columns={{ base: 1, sm: 2 }} spacing={5}>
              <InputFieldDayDate
                name='etdDay'
                label='Día de Zarpe (ETD)'
                helperText='El precio sale del contrato vigente este día.'
              />
              <InputFieldPlain
                name='etdTime'
                label='Hora de Zarpe'
                placeholder='HH:mm, por ejemplo 18:00'
                inputMode='numeric'
              />
            </SimpleGrid>
            <RouteInForceSelect />

            <Heading fontSize='2xl' p='16px'>
              Contenedores
            </Heading>
            <Divider mb='16px' />
            <SimpleGrid columns={{ base: 1, sm: 2 }} spacing={5}>
              <InputFieldPlain
                name='containerCount'
                label='Contenedores Reservados'
                inputMode='numeric'
              />
            </SimpleGrid>
            <Text fontSize='sm' color='gray.600'>
              Los números se pueden cargar ahora o cuando la naviera los asigne.
            </Text>
            <FieldArray name='containers'>
              {({ push, remove }) => (
                <Flex direction='column' gap={3}>
                  {values.containers.map((_, index) => (
                    <HStack key={index} align='flex-start'>
                      <InputFieldPlain
                        name={`containers[${index}]`}
                        placeholder={`Contenedor ${index + 1}, como MSKU1234567`}
                      />
                      <IconButton
                        aria-label={`Quitar el contenedor ${index + 1}`}
                        icon={<FiTrash2 />}
                        variant='ghost'
                        colorScheme='red'
                        onClick={() => remove(index)}
                      />
                    </HStack>
                  ))}
                  {typeof errors.containers === 'string' && (
                    <Text color='red.500' fontSize='sm'>
                      {errors.containers}
                    </Text>
                  )}
                  <Button
                    alignSelf='flex-start'
                    leftIcon={<FiPlus />}
                    variant='outline'
                    colorScheme='green'
                    isDisabled={
                      values.containers.length >=
                      (Number(values.containerCount) || 0)
                    }
                    onClick={() => push('')}
                  >
                    Agregar Número de Contenedor
                  </Button>
                </Flex>
              )}
            </FieldArray>

            <Flex gap={3} mt='12px' direction={{ base: 'column', sm: 'row' }}>
              <Button
                flex={1}
                type='submit'
                colorScheme='teal'
                isLoading={isLoading}
              >
                {booking ? 'Guardar Cambios' : 'Crear Booking'}
              </Button>
              {booking && (
                <Button
                  variant='outline'
                  colorScheme='red'
                  onClick={confirm.onOpen}
                  isLoading={isDeleting}
                >
                  Eliminar Booking
                </Button>
              )}
            </Flex>
          </Flex>

          <AlertDialog
            isOpen={confirm.isOpen}
            leastDestructiveRef={cancelRef}
            onClose={confirm.onClose}
          >
            <AlertDialogOverlay>
              <AlertDialogContent>
                <AlertDialogHeader fontSize='lg' fontWeight='bold'>
                  Eliminar booking
                </AlertDialogHeader>
                <AlertDialogBody>
                  Se eliminará el booking {booking?.bookingNumber} con sus
                  números de contenedor.
                </AlertDialogBody>
                <AlertDialogFooter>
                  <Button ref={cancelRef} onClick={confirm.onClose}>
                    Volver
                  </Button>
                  <Button
                    colorScheme='red'
                    ml={3}
                    isLoading={isDeleting}
                    onClick={() => {
                      confirm.onClose();
                      onDelete();
                    }}
                  >
                    Eliminar
                  </Button>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialogOverlay>
          </AlertDialog>
        </Form>
      )}
    </Formik>
  );
}
