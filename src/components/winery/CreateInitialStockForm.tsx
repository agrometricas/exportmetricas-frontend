'use client';

import { Button, Flex, SimpleGrid } from '@chakra-ui/react';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import { FormSectionTitle } from '@/components/ui/form/FormSection';
import { toaster } from '@/components/ui/toaster';
import { useCreateExporterMaterialStock } from '../../hooks/winery/useCreateExporterMaterialStock';
import { serverErrorMessage } from '../../utils/serverErrorMessage';
import CheckboxForm from '../ui/form/CheckboxForm';
import InputFieldNumber from '../ui/form/InputFieldNumber';

interface Props {
  exporterId: number;
  materialType: string;
  materialId: number;
  materialName: string;
}

export interface ValuesProps {
  assignedStock: number;
  assignedCost: number;
  dataReviewed: boolean;
}

const initialValues: ValuesProps = {
  assignedStock: 0,
  assignedCost: 0,
  dataReviewed: false,
};

const validationSchema = Yup.object({
  assignedStock: Yup.number()
    .min(1, 'Debe ser mayor a 0')
    .required('Requerido'),
  assignedCost: Yup.number()
    .min(0.01, 'Debe ser mayor a 0')
    .required('Requerido'),
  dataReviewed: Yup.boolean()
    .oneOf([true], 'Debes revisar los datos antes de enviar')
    .required('Requerido'),
});

export function CreateInitialStockForm({
  exporterId,
  materialType,
  materialId,
  materialName,
}: Props): JSX.Element {
  const { mutate, isLoading } = useCreateExporterMaterialStock();

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={(values) => {
        const { dataReviewed, ...sanitizedValues } = values;
        void dataReviewed;
        mutate(
          {
            exporterId,
            materialType,
            materialId,
            materialName,
            ...sanitizedValues,
          },
          {
            onSuccess: () => {
              toaster.create({
                title: 'Stock creado con éxito.',
                type: 'success',
                duration: 3000,
                closable: true,
              });
              location.reload();
            },
            onError: (error: unknown) => {
              toaster.create({
                title: 'Error al crear el stock.',
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
      {() => (
        <Form>
          <Flex flexDirection='column' gap={3}>
            <FormSectionTitle>Material: {materialName}</FormSectionTitle>
            <SimpleGrid columns={{ base: 1, md: 2 }} gap={4}>
              <InputFieldNumber
                name='assignedStock'
                label='Stock asignado'
                placeholder='Cantidad inicial'
              />
              <InputFieldNumber
                name='assignedCost'
                label='Costo asignado'
                placeholder='Costo unitario'
                isDecimal
                unit='$'
              />
            </SimpleGrid>
            <SimpleGrid columns={{ base: 1, sm: 1 }}>
              <CheckboxForm
                name='dataReviewed'
                label='He revisado los datos agregados'
              />
              <Button
                mt='12px'
                py='8px'
                px='16px'
                type='submit'
                colorPalette='green'
                loading={isLoading}
              >
                Crear Stock Inicial
              </Button>
            </SimpleGrid>
          </Flex>
        </Form>
      )}
    </Formik>
  );
}
