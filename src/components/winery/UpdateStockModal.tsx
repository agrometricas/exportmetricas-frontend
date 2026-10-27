'use client';

import {
  Button,
  Text,
  Box,
  SimpleGrid,
  Separator,
  Dialog,
  Portal,
} from '@chakra-ui/react';
import { Formik, Form } from 'formik';
import React from 'react';
import * as Yup from 'yup';
import { toaster } from '@/components/ui/toaster';
import { useUpdateExporterMaterialStock } from '@/hooks/winery/useUpdateExporterMaterialStock';
import { serverErrorMessage } from '../../utils/serverErrorMessage';
import InputFieldNumber from '../ui/form/InputFieldNumber';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  stockId: number;
  initialStock: number;
  initialCost: number;
}

const validationSchema = Yup.object({
  addedStock: Yup.number().min(1, 'Debe ser mayor a 0').required('Requerido'),
  cost: Yup.number().min(0.01, 'Debe ser mayor a 0').required('Requerido'),
});

export function UpdateStockModal({
  isOpen,
  onClose,
  stockId,
  initialStock,
  initialCost,
}: Props): React.JSX.Element {
  const { mutate, isPending: isLoading } =
    useUpdateExporterMaterialStock(stockId);

  return (
    <Dialog.Root
      open={isOpen}
      placement='center'
      onOpenChange={(e) => {
        if (!e.open) {
          onClose();
        }
      }}
    >
      <Portal>
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Content>
            <Dialog.Header>Actualizar stock</Dialog.Header>
            <Dialog.CloseTrigger />
            <Dialog.Body>
              <Formik
                initialValues={{ addedStock: 0, cost: initialCost }}
                validationSchema={validationSchema}
                onSubmit={(values) => {
                  const currentStock = initialStock + values.addedStock;
                  mutate(
                    { currentStock, currentCost: values.cost },
                    {
                      onSuccess: () => {
                        toaster.create({
                          title: 'Stock actualizado con éxito.',
                          type: 'success',
                          duration: 3000,
                          closable: true,
                        });
                        onClose();
                      },
                      onError: (error: unknown) => {
                        toaster.create({
                          title: 'Error al actualizar el stock.',
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
                        name='initialStock'
                        label='Stock actual'
                        value={initialStock}
                        isReadOnly
                      />
                      <InputFieldNumber
                        name='addedStock'
                        label='Agregar nuevo stock'
                        placeholder='Cantidad'
                      />
                    </SimpleGrid>

                    <Box mt={4} mb={2}>
                      <Text fontWeight='bold'>Nuevo total de stock:</Text>
                      <Text ml={4}>{initialStock + values.addedStock}</Text>
                    </Box>

                    <InputFieldNumber
                      name='cost'
                      label='Costo actual'
                      value={initialCost}
                      isDecimal
                      unit='$'
                    />

                    <Separator my={4} />

                    <Dialog.Footer px={0}>
                      <Button onClick={onClose} mr={3}>
                        Cancelar
                      </Button>
                      <Button
                        type='submit'
                        colorPalette='green'
                        loading={isLoading}
                        disabled={values.addedStock <= 0}
                      >
                        Guardar
                      </Button>
                    </Dialog.Footer>
                  </Form>
                )}
              </Formik>
            </Dialog.Body>
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  );
}
