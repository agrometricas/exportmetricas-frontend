import {
  Button,
  Flex,
  HStack,
  IconButton,
  SimpleGrid,
  Text,
  useDisclosure,
  Dialog,
  Portal,
} from '@chakra-ui/react';
import { FieldArray, Form, Formik } from 'formik';
import React, { useRef } from 'react';
import { FiPlus, FiTrash2 } from 'react-icons/fi';
import {
  FormSectionTitle,
  FormActions,
} from '@/components/ui/form/FormSection';
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
            <FormSectionTitle>Reserva</FormSectionTitle>
            <SimpleGrid columns={{ base: 1, sm: 2 }} gap={5}>
              <InputFieldPlain name='bookingNumber' label='Número de Booking' />
              <InputFieldShippingCompanySelect
                name='shippingCompanyId'
                label='Naviera'
                placeholder='Selecciona la naviera'
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

            <FormSectionTitle>Zarpe y Ruta</FormSectionTitle>
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

            <FormSectionTitle>Contenedores</FormSectionTitle>
            <SimpleGrid columns={{ base: 1, sm: 2 }} gap={5}>
              <InputFieldPlain
                name='containerCount'
                label='Contenedores Reservados'
                inputMode='numeric'
              />
            </SimpleGrid>
            <Text fontSize='sm' color='fg.muted'>
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
                    <Text color='red.fg' fontSize='sm'>
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

            <FormActions>
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
              <Button type='submit' colorPalette='green' loading={isLoading}>
                {booking ? 'Guardar Cambios' : 'Crear Booking'}
              </Button>
            </FormActions>
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
