'use client';

import {
  Box,
  Button,
  SimpleGrid,
  Text,
  Separator,
  Dialog,
} from '@chakra-ui/react';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import { toaster } from '@/components/ui/toaster';
import { useIncreaseBusinessStock } from '@/hooks/winery/useIncreaseBusinessStock';
import { serverErrorMessage } from '../../utils/serverErrorMessage';
import InputFieldNumber from '../ui/form/InputFieldNumber';

interface Props {
  stockId: number;
  currentStock: number;
  currentCost: number;
  businessName: string;
  businessCurrentStock: number;
  businessAssignedStock: number;
  maxAssignableStock: number;
  onClose: () => void;
  onBack: () => void;
}

const validationSchema = (
  max: number
): Yup.ObjectSchema<{ addedStock: number }> =>
  Yup.object({
    addedStock: Yup.number()
      .min(1, 'Debe ser mayor a 0')
      .max(max, `No puede asignar más de ${max}`)
      .required('Requerido'),
  });

export function AssignStockToBusinessForm({
  stockId,
  currentStock,
  currentCost,
  businessName,
  businessCurrentStock,
  businessAssignedStock,
  maxAssignableStock,
  onClose,
  onBack,
}: Props): JSX.Element {
  const { mutate, isLoading } = useIncreaseBusinessStock(stockId);

  return (
    <Formik
      initialValues={{ addedStock: 0 }}
      validationSchema={validationSchema(maxAssignableStock)}
      onSubmit={(values) => {
        const newStock = businessCurrentStock + values.addedStock;
        mutate(
          { currentStock: newStock },
          {
            onSuccess: () => {
              toaster.create({
                title: 'Stock asignado exitosamente.',
                type: 'success',
                duration: 3000,
                closable: true,
              });
              onClose();
            },
            onError: (error: unknown) => {
              toaster.create({
                title: 'Error al asignar stock.',
                description: serverErrorMessage(error),
                type: 'error',
                duration: 3000,
                closable: true,
              });
            },
          }
        );
      }}
    >
      {({ values }) => (
        <Form>
          <SimpleGrid columns={{ base: 1, md: 2 }} gap={3}>
            <InputFieldNumber
              name='currentStock'
              label='Stock disponible'
              value={currentStock}
              isReadOnly
            />
            <InputFieldNumber
              name='addedStock'
              label='Cantidad a asignar'
              placeholder='0'
            />
          </SimpleGrid>

          <Box mt={4} mb={2}>
            <Text fontWeight='bold'>Nuevo total de stock:</Text>
            <Text ml={4}>{businessCurrentStock + values.addedStock}</Text>
          </Box>

          <Box mt={4}>
            <Text fontWeight='bold'>Stock actual en {businessName}:</Text>
            <Text ml={4}>{businessCurrentStock}</Text>
            <Text fontWeight='bold' mt={2}>
              Stock asignado a finca:
            </Text>
            <Text ml={4}>{businessAssignedStock}</Text>
            <Text fontWeight='bold' mt={2}>
              Costo actual:
            </Text>
            <Text ml={4}>${currentCost.toFixed(2)}</Text>
          </Box>

          <Separator my={4} />

          <Dialog.Footer px={0}>
            <Button onClick={onBack} mr={3}>
              Volver
            </Button>
            <Button onClick={onClose} mr={3}>
              Cancelar
            </Button>
            <Button
              type='submit'
              colorPalette='green'
              loading={isLoading}
              disabled={values.addedStock <= 0}
            >
              Asignar
            </Button>
          </Dialog.Footer>
        </Form>
      )}
    </Formik>
  );
}
