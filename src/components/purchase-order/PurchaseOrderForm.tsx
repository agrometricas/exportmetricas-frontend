import {
  Box,
  Button,
  Flex,
  Input,
  SimpleGrid,
  Text,
  useDisclosure,
  Dialog,
  Portal,
  Field,
} from '@chakra-ui/react';
import { FieldArray, Form, Formik } from 'formik';
import React, { useRef } from 'react';
import { FiPlus } from 'react-icons/fi';
import {
  FormSectionTitle,
  FormActions,
} from '@/components/ui/form/FormSection';
import { useSubmitPurchaseOrder } from './hooks/useSubmitPurchaseOrder';
import PurchaseOrderLineRow from './PurchaseOrderLineRow';
import {
  emptyLine,
  isCompleteDay,
  ORDER_TYPES,
} from './schemas/purchaseOrder.schema';
import { PurchaseOrderResponse } from '../../types/purchaseOrder';
import { getWeekInfo } from '../../utils/getWeekInfo';
import InputFieldClientSelect from '../client/InputFieldClientSelect';
import InputFieldDayDate from '../ui/form/InputFieldDayDate';
import InputFieldPlain from '../ui/form/InputFieldPlain';
import InputFieldSelector from '../ui/form/InputFieldSelector';

const weekText = (day: string, fallback: string): string =>
  isCompleteDay(day) ? getWeekInfo({ date: new Date(day) }).week : fallback;

export default function PurchaseOrderForm({
  order,
}: {
  order?: PurchaseOrderResponse;
}): React.JSX.Element {
  const {
    onSubmit,
    onDelete,
    initialValues,
    validationSchema,
    isLoading,
    isDeleting,
  } = useSubmitPurchaseOrder(order);
  const confirm = useDisclosure();
  const cancelRef = useRef<HTMLButtonElement>(null);

  return (
    <Formik
      initialValues={initialValues}
      onSubmit={onSubmit}
      validationSchema={validationSchema}
      enableReinitialize
    >
      {({ values, errors }) => (
        <Form>
          <Flex flexDirection='column' gap={3}>
            <FormSectionTitle>Cliente y semanas</FormSectionTitle>
            <SimpleGrid columns={{ base: 1, sm: 2 }} gap={5}>
              {order ? (
                <>
                  <Field.Root>
                    <Field.Label fontSize='sm' mb='8px'>
                      Cliente
                    </Field.Label>
                    <Input readOnly value={order.client.businessName} />
                  </Field.Root>
                  <Field.Root>
                    <Field.Label fontSize='sm' mb='8px'>
                      Tipo
                    </Field.Label>
                    <Input
                      readOnly
                      value={
                        ORDER_TYPES.find((type) => type.id === order.type)
                          ?.name ?? ''
                      }
                    />
                  </Field.Root>
                </>
              ) : (
                <>
                  <InputFieldClientSelect
                    name='clientId'
                    label='Cliente'
                    placeholder='Selecciona el cliente'
                  />
                  <InputFieldSelector
                    name='type'
                    label='Tipo'
                    options={ORDER_TYPES}
                  />
                </>
              )}
              <InputFieldDayDate
                name='startDay'
                label={values.type === 'SPOT' ? 'Semana' : 'Semana de inicio'}
                helperText={weekText(
                  values.startDay,
                  'Escribe cualquier día de la semana.'
                )}
              />
              {values.type === 'CONTRACT' && (
                <InputFieldDayDate
                  name='endDay'
                  label='Semana de fin (opcional)'
                  helperText={weekText(
                    values.endDay,
                    'Sin semana de fin, el contrato queda abierto.'
                  )}
                />
              )}
            </SimpleGrid>
            <InputFieldPlain name='notes' label='Notas' />

            <FormSectionTitle>Lo que pide</FormSectionTitle>
            <Text fontSize='sm' color='fg.muted'>
              {values.type === 'CONTRACT'
                ? 'Cada alícuota con las cajas que pide todas las semanas y su precio de contrato.'
                : 'Cada alícuota con las cajas que pide esa semana. Si todavía no se sabe el precio, déjalo vacío.'}
            </Text>
            <FieldArray name='lines'>
              {({ push, remove }) => (
                <Flex direction='column' gap={3}>
                  {values.lines.map((line, index) => (
                    <PurchaseOrderLineRow
                      key={line.id ?? `new-${index}`}
                      index={index}
                      saved={order?.lines.find((s) => s.id === line.id)}
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
                    onClick={() => push(emptyLine)}
                  >
                    <FiPlus />
                    Agregar alícuota
                  </Button>
                </Flex>
              )}
            </FieldArray>

            <FormActions>
              {order && (
                <Button
                  variant='outline'
                  colorPalette='red'
                  onClick={confirm.onOpen}
                  loading={isDeleting}
                >
                  Eliminar orden
                </Button>
              )}
              <Button type='submit' colorPalette='green' loading={isLoading}>
                {order ? 'Guardar cambios' : 'Crear orden de compra'}
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
                      Eliminar orden de compra
                    </Dialog.Header>
                    <Dialog.Body>
                      <Box>
                        Se eliminará la orden de {order?.client.businessName}.
                        Las exportaciones ya asignadas no se tocan.
                      </Box>
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
