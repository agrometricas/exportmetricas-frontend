'use client';

import {
  Box,
  Button,
  ModalFooter,
  SimpleGrid,
  Text,
  useToast,
} from '@chakra-ui/react';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
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
  quantity: number;
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
}: Props): JSX.Element {
  const toast = useToast();
  const { mutate, isLoading } = useCreateBusinessStockAssignment();

  return (
    <Formik
      initialValues={{ quantity: 0 }}
      validationSchema={validationSchema(availableStock)}
      onSubmit={(values) => {
        mutate(
          {
            exporterId,
            businessId: business.id,
            materialType,
            materialId,
            quantity: values.quantity,
          },
          {
            onSuccess: () => {
              toast({
                title: 'Stock Asignado Exitosamente.',
                status: 'success',
                duration: 3000,
                isClosable: true,
              });
              onClose();
            },
            onError: (error: unknown) => {
              toast({
                title: 'Error al Asignar Stock.',
                description: serverErrorMessage(error),
                status: 'error',
                duration: 3000,
                isClosable: true,
              });
            },
          }
        );
      }}
    >
      {({ values }) => (
        <Form>
          <SimpleGrid columns={{ base: 1, md: 2 }} spacing={3}>
            <InputFieldNumber
              name='availableStock'
              label='Stock Disponible'
              value={availableStock}
              isReadOnly
            />
            <InputFieldNumber
              name='quantity'
              label='Cantidad a Asignar'
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

          <ModalFooter px={0}>
            <Button onClick={onBack} mr={3}>
              Regresar
            </Button>
            <Button
              type='submit'
              colorScheme='teal'
              isLoading={isLoading}
              isDisabled={values.quantity <= 0}
            >
              Asignar
            </Button>
          </ModalFooter>
        </Form>
      )}
    </Formik>
  );
}
