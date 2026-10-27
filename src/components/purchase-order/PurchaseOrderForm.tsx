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
import Link_Next from 'next/link';
import React, { useRef } from 'react';
import { FiPlus } from 'react-icons/fi';
import {
  FormSectionTitle,
  FormActions,
} from '@/components/ui/form/FormSection';
import { useSubmitPurchaseOrder } from './hooks/useSubmitPurchaseOrder';
import { purchaseOrderQuoteBody } from './purchaseOrderBody';
import PurchaseOrderLineRow from './PurchaseOrderLineRow';
import QuotaSummary from './QuotaSummary';
import {
  emptyLine,
  isCompleteDay,
  ValuesProps,
} from './schemas/purchaseOrder.schema';
import { usePurchaseOrderQuote } from '../../hooks/purchase-order/usePurchaseOrderQuote';
import { PurchaseOrderResponse } from '../../types/purchaseOrder';
import { getWeekInfo } from '../../utils/getWeekInfo';
import InputFieldProducerSelect from '../producer/InputFieldProducerSelect';
import InputFieldDayDate from '../ui/form/InputFieldDayDate';
import InputFieldPlain from '../ui/form/InputFieldPlain';

function DraftQuota({ values }: { values: ValuesProps }): React.JSX.Element {
  const { quota, isFetching } = usePurchaseOrderQuote(
    purchaseOrderQuoteBody(values)
  );
  return <QuotaSummary quota={quota} isFetching={isFetching} />;
}

const weekText = (day: string): string =>
  isCompleteDay(day)
    ? getWeekInfo({ date: new Date(day) }).week
    : 'Escribe cualquier día de la semana.';

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
  const exportedLines = order?.lines.filter((line) => line.export).length ?? 0;

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
            <FormSectionTitle>Productor y Semana</FormSectionTitle>
            <SimpleGrid columns={{ base: 1, sm: 2 }} gap={5}>
              {order ? (
                <Field.Root>
                  <Field.Label fontSize='sm' mb='8px'>
                    Productor
                  </Field.Label>
                  <Input readOnly value={order.merchant.businessName} />
                </Field.Root>
              ) : (
                <InputFieldProducerSelect
                  name='merchantId'
                  label='Productor'
                  placeholder='Selecciona el productor'
                />
              )}
              <InputFieldDayDate
                name='weekDay'
                label='Semana'
                helperText={weekText(values.weekDay)}
              />
            </SimpleGrid>
            <InputFieldPlain name='notes' label='Notas' />

            <FormSectionTitle>Líneas</FormSectionTitle>
            <Text fontSize='sm' color='fg.muted'>
              Cada línea es una finca, una alícuota y sus cajas. Márcala como
              contrato si va contra el cupo del productor, o como spot.
            </Text>
            {order && exportedLines < order.lines.length && (
              <Button
                alignSelf='flex-start'
                size='sm'
                colorPalette='green'
                asChild
              >
                <Link_Next
                  href={`/dashboard/export/purchase-orders/${order.id}/plan`}
                >
                  Plan semanal: crear varias exportaciones
                </Link_Next>
              </Button>
            )}
            <FieldArray name='lines'>
              {({ push, remove }) => (
                <Flex direction='column' gap={3}>
                  {values.lines.map((line, index) => (
                    <PurchaseOrderLineRow
                      key={line.id ?? `new-${index}`}
                      index={index}
                      merchant={Number(values.merchantId) || undefined}
                      orderId={order?.id}
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
                    Agregar Línea
                  </Button>
                </Flex>
              )}
            </FieldArray>

            <FormSectionTitle>Cupo de la Semana</FormSectionTitle>
            <DraftQuota values={values} />

            <FormActions>
              {order && (
                <Button
                  variant='outline'
                  colorPalette='red'
                  onClick={confirm.onOpen}
                  loading={isDeleting}
                  disabled={exportedLines > 0}
                  title={
                    exportedLines > 0
                      ? 'Cancela sus exportaciones para eliminarla'
                      : undefined
                  }
                >
                  Eliminar Orden
                </Button>
              )}
              <Button type='submit' colorPalette='green' loading={isLoading}>
                {order ? 'Guardar Cambios' : 'Crear Orden de Compra'}
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
                        Se eliminará la orden de {order?.merchant.businessName}{' '}
                        con sus líneas.
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
