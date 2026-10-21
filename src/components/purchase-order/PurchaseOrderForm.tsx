import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Box,
  Button,
  Divider,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Input,
  SimpleGrid,
  Text,
  useDisclosure,
} from '@chakra-ui/react';
import { FieldArray, Form, Formik } from 'formik';
import Link_Next from 'next/link';
import React, { useRef } from 'react';
import { FiPlus } from 'react-icons/fi';
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
            <Heading fontSize='2xl' p='12px'>
              Productor y Semana
            </Heading>
            <Divider mb='16px' />
            <SimpleGrid columns={{ base: 1, sm: 2 }} spacing={5}>
              {order ? (
                <FormControl>
                  <FormLabel fontSize='sm' mb='8px'>
                    Productor
                  </FormLabel>
                  <Input isReadOnly value={order.merchant.businessName} />
                </FormControl>
              ) : (
                <InputFieldProducerSelect
                  name='merchantId'
                  label='Productor'
                  placeholder='Seleccione el productor'
                />
              )}
              <InputFieldDayDate
                name='weekDay'
                label='Semana'
                helperText={weekText(values.weekDay)}
              />
            </SimpleGrid>
            <InputFieldPlain name='notes' label='Notas' />

            <Heading fontSize='2xl' p='16px'>
              Líneas
            </Heading>
            <Divider mb='16px' />
            <Text fontSize='sm' color='gray.600'>
              Cada línea es una finca, una alícuota y sus cajas. Márcala como
              contrato si va contra el cupo del productor, o como spot.
            </Text>
            {order && exportedLines < order.lines.length && (
              <Button
                as={Link_Next}
                href={`/dashboard/export/purchase-orders/${order.id}/plan`}
                alignSelf='flex-start'
                size='sm'
                colorScheme='green'
              >
                Plan semanal: crear varias exportaciones
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
                    <Text color='red.500' fontSize='sm'>
                      {errors.lines}
                    </Text>
                  )}
                  <Button
                    alignSelf='flex-start'
                    leftIcon={<FiPlus />}
                    variant='outline'
                    colorScheme='green'
                    onClick={() => push(emptyLine)}
                  >
                    Agregar Línea
                  </Button>
                </Flex>
              )}
            </FieldArray>

            <Heading fontSize='2xl' p='16px'>
              Cupo de la Semana
            </Heading>
            <Divider mb='16px' />
            <DraftQuota values={values} />

            <Flex gap={3} mt='12px' direction={{ base: 'column', sm: 'row' }}>
              <Button
                flex={1}
                type='submit'
                colorScheme='teal'
                isLoading={isLoading}
              >
                {order ? 'Guardar Cambios' : 'Crear Orden de Compra'}
              </Button>
              {order && (
                <Button
                  variant='outline'
                  colorScheme='red'
                  onClick={confirm.onOpen}
                  isLoading={isDeleting}
                  isDisabled={exportedLines > 0}
                  title={
                    exportedLines > 0
                      ? 'Cancela sus exportaciones para eliminarla'
                      : undefined
                  }
                >
                  Eliminar Orden
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
                  Eliminar orden de compra
                </AlertDialogHeader>
                <AlertDialogBody>
                  <Box>
                    Se eliminará la orden de {order?.merchant.businessName} con
                    sus líneas.
                  </Box>
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
