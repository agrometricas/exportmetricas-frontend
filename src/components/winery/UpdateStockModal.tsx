'use client';

import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Button,
  useToast,
  Text,
  Box,
  SimpleGrid,
  Divider,
} from '@chakra-ui/react';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
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
}: Props): JSX.Element {
  const toast = useToast();
  const { mutate, isLoading } = useUpdateExporterMaterialStock(stockId);

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Actualizar Stock</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Formik
            initialValues={{ addedStock: 0, cost: initialCost }}
            validationSchema={validationSchema}
            onSubmit={(values) => {
              const currentStock = initialStock + values.addedStock;
              mutate(
                { currentStock, currentCost: values.cost },
                {
                  onSuccess: () => {
                    toast({
                      title: 'Stock Actualizado con Éxito.',
                      status: 'success',
                      duration: 3000,
                      isClosable: true,
                    });
                    onClose();
                  },
                  onError: (error: unknown) => {
                    toast({
                      title: 'Error al Actualizar el Stock.',
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
                    name='initialStock'
                    label='Stock Actual'
                    value={initialStock}
                    isReadOnly
                  />
                  <InputFieldNumber
                    name='addedStock'
                    label='Agregar Nuevo Stock'
                    placeholder='Cantidad'
                  />
                </SimpleGrid>

                <Box mt={4} mb={2}>
                  <Text fontWeight='bold'>Nuevo Total de Stock:</Text>
                  <Text ml={4}>{initialStock + values.addedStock}</Text>
                </Box>

                <InputFieldNumber
                  name='cost'
                  label='Costo Actual'
                  value={initialCost}
                  isDecimal
                  unit='$'
                />

                <Divider my={4} />

                <ModalFooter px={0}>
                  <Button onClick={onClose} mr={3}>
                    Cancelar
                  </Button>
                  <Button
                    type='submit'
                    colorScheme='teal'
                    isLoading={isLoading}
                    isDisabled={values.addedStock <= 0}
                  >
                    Guardar
                  </Button>
                </ModalFooter>
              </Form>
            )}
          </Formik>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
