import {
  Button,
  Flex,
  Heading,
  HStack,
  IconButton,
  SimpleGrid,
  Text,
  useDisclosure,
  Dialog,
  Portal,
  Separator,
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
            <Separator mb='16px' />
            <SimpleGrid columns={{ base: 1, sm: 2 }} gap={5}>
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
            <Separator mb='16px' />
            <SimpleGrid columns={{ base: 1, sm: 2 }} gap={5}>
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
            <Separator mb='16px' />
            <SimpleGrid columns={{ base: 1, sm: 2 }} gap={5}>
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
                        variant='ghost'
                        colorPalette='red'
                        onClick={() => remove(index)}
                      >
                        <FiTrash2 />
                      </IconButton>
                    </HStack>
                  ))}
                  {typeof errors.containers === 'string' && (
                    <Text color='red.500' fontSize='sm'>
                      {errors.containers}
                    </Text>
                  )}
                  <Button
                    alignSelf='flex-start'
                    variant='outline'
                    colorPalette='green'
                    disabled={
                      values.containers.length >=
                      (Number(values.containerCount) || 0)
                    }
                    onClick={() => push('')}
                  >
                    <FiPlus />
                    Agregar Número de Contenedor
                  </Button>
                </Flex>
              )}
            </FieldArray>

            <Flex gap={3} mt='12px' direction={{ base: 'column', sm: 'row' }}>
              <Button
                flex={1}
                type='submit'
                colorPalette='green'
                loading={isLoading}
              >
                {booking ? 'Guardar Cambios' : 'Crear Booking'}
              </Button>
              {booking && (
                <Button
                  variant='outline'
                  colorPalette='red'
                  onClick={confirm.onOpen}
                  loading={isDeleting}
                >
                  Eliminar Booking
                </Button>
              )}
            </Flex>
          </Flex>

          <Dialog.Root
            open={confirm.open}
            initialFocusEl={() => cancelRef.current}
            role='alertdialog'
            onOpenChange={(e) => {
              if (!e.open) {
                confirm.onClose();
              }
            }}
          >
            <Portal>
              <Dialog.Backdrop>
                <Dialog.Positioner>
                  <Dialog.Content>
                    <Dialog.Header fontSize='lg' fontWeight='bold'>
                      Eliminar booking
                    </Dialog.Header>
                    <Dialog.Body>
                      Se eliminará el booking {booking?.bookingNumber} con sus
                      números de contenedor.
                    </Dialog.Body>
                    <Dialog.Footer>
                      <Button ref={cancelRef} onClick={confirm.onClose}>
                        Volver
                      </Button>
                      <Button
                        colorPalette='red'
                        ml={3}
                        loading={isDeleting}
                        onClick={() => {
                          confirm.onClose();
                          onDelete();
                        }}
                      >
                        Eliminar
                      </Button>
                    </Dialog.Footer>
                  </Dialog.Content>
                </Dialog.Positioner>
              </Dialog.Backdrop>
            </Portal>
          </Dialog.Root>
        </Form>
      )}
    </Formik>
  );
}
