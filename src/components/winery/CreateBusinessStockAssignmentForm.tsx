'use client';

import { Box, Button, SimpleGrid, Text, Dialog } from '@chakra-ui/react';
import { Formik, Form } from 'formik';
import React from 'react';
import * as Yup from 'yup';
import { toaster } from '@/components/ui/toaster';
import { useCreateBusinessStockAssignment } from '../../hooks/winery/useCreateBusinessStockAssignment';
import { Business } from '../../types/cuttingSheet.response';
import { serverErrorMessage } from '../../utils/serverErrorMessage';
import InputFieldNumber from '../ui/form/InputFieldNumber';

interface Props {
  exporterId: number;
  business: Business;
  materialType: string;
  materialId: number;
  availableStock: number;
  onBack: () => void;
  onClose: () => void;
}

const validationSchema = (
  max: number
): Yup.ObjectSchema<{
  quantity: number | '';
}> =>
  Yup.object({
    quantity: Yup.number()
      .min(1, 'Debe ser mayor a 0')
      .max(max, `No puede asignar más de ${max}`)
      .required('Requerido'),
  });

export function CreateBusinessStockAssignmentForm({
  exporterId,
  business,
  materialType,
  materialId,
  availableStock,
  onBack,
  onClose,
}: Props): React.JSX.Element {
  const { mutate, isPending: isLoading } = useCreateBusinessStockAssignment();

  return (
    <Formik
      initialValues={{ quantity: '' }}
      validationSchema={validationSchema(availableStock)}
      onSubmit={(values) => {
        mutate(
          {
            exporterId,
            businessId: business.id,
            materialType,
            materialId,
            quantity: Number(values.quantity),
          },
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
              name='availableStock'
              label='Stock disponible'
              value={availableStock}
              isReadOnly
            />
            <InputFieldNumber
              name='quantity'
              label='Cantidad a asignar'
              placeholder='0'
            />
          </SimpleGrid>

          <Box mt={4}>
            <Text fontWeight='bold'>Finca:</Text>
            <Text>{business.name}</Text>
            <Text fontWeight='bold' mt={2}>
              MAGAP:
            </Text>
            <Text>{business.codeMAGAP}</Text>
          </Box>

          <Dialog.Footer px={0}>
            <Button onClick={onBack} mr={3}>
              Regresar
            </Button>
            <Button
              type='submit'
              colorPalette='green'
              loading={isLoading}
              disabled={Number(values.quantity) <= 0}
            >
              Asignar
            </Button>
          </Dialog.Footer>
        </Form>
      )}
    </Formik>
  );
}
