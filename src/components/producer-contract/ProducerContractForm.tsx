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
  FormLabel,
  Heading,
  Input,
  SimpleGrid,
  useDisclosure,
} from '@chakra-ui/react';
import { Form, Formik } from 'formik';
import React, { useRef } from 'react';
import { useSubmitProducerContract } from './hooks/useSubmitProducerContract';
import { ProducerContractResponse } from '../../types/producerContract';
import SelectBusiness from '../business/SelectBusiness';
import SelectProducer from '../producer/SelectProducer';
import InputFieldDayDate from '../ui/form/InputFieldDayDate';
import InputFieldNumber from '../ui/form/InputFieldNumber';
import InputFieldSelector from '../ui/form/InputFieldSelector';

const CONTRACT_TYPE_OPTIONS = [
  { name: 'FAS (FREE ALONGSIDE SHIP)', id: 'FAS' },
  { name: 'FOB (FREE ON BOARD)', id: 'FOB' },
];

export default function ProducerContractForm({
  contract,
}: {
  contract?: ProducerContractResponse;
}): React.JSX.Element {
  const {
    onSubmit,
    onDelete,
    initialValues,
    validationSchema,
    isLoading,
    isDeleting,
  } = useSubmitProducerContract(contract);
  const confirm = useDisclosure();
  const cancelRef = useRef<HTMLButtonElement>(null);

  return (
    <Formik
      initialValues={initialValues}
      onSubmit={onSubmit}
      validationSchema={validationSchema}
      enableReinitialize
    >
      {({ values }) => (
        <Form>
          <Flex flexDirection='column' gap={3}>
            <Heading fontSize={'2xl'} p={'12px'}>
              Finca
            </Heading>
            <Divider mb={'16px'} />
            {contract ? (
              <SimpleGrid columns={{ base: 1, sm: 2 }} spacing={5}>
                <Box>
                  <FormLabel fontSize='sm'>Productor</FormLabel>
                  <Input
                    isReadOnly
                    value={contract.business.merchant?.businessName ?? ''}
                  />
                </Box>
                <Box>
                  <FormLabel fontSize='sm'>Finca</FormLabel>
                  <Input isReadOnly value={contract.business.name} />
                </Box>
              </SimpleGrid>
            ) : (
              <>
                <SelectProducer name='merchantId' />
                <SelectBusiness
                  name='businessId'
                  merchant={Number(values.merchantId) || undefined}
                />
              </>
            )}

            <Heading fontSize={'2xl'} p={'16px'}>
              Cupo Aprobado
            </Heading>
            <Divider mb={'16px'} />
            <SimpleGrid columns={{ base: 1, sm: 2 }} spacing={5}>
              <InputFieldNumber
                name='approvedHectares'
                label='Hectáreas Aprobadas'
                unit='ha'
                value={initialValues.approvedHectares}
              />
              <InputFieldNumber
                name='approvedWeeklyBoxesPerHectare'
                label='Cajas Aprobadas por Hectárea a la Semana'
                unit='cajas/ha'
                value={initialValues.approvedWeeklyBoxesPerHectare}
              />
              <InputFieldSelector
                name='contractType'
                label='Tipo de Contrato (opcional)'
                options={CONTRACT_TYPE_OPTIONS}
              />
            </SimpleGrid>

            <Heading fontSize={'2xl'} p={'16px'}>
              Vigencia
            </Heading>
            <Divider mb={'16px'} />
            <SimpleGrid columns={{ base: 1, sm: 2 }} spacing={5}>
              <InputFieldDayDate name='startDate' label='Fecha de Inicio' />
              <InputFieldDayDate
                name='endDate'
                label='Fecha de Fin (opcional)'
                helperText='Sin fecha de fin, el contrato queda abierto.'
              />
            </SimpleGrid>

            <Flex gap={3} mt='12px' direction={{ base: 'column', sm: 'row' }}>
              <Button
                flex={1}
                type='submit'
                colorScheme='teal'
                isLoading={isLoading}
              >
                {contract ? 'Guardar Cambios' : 'Crear Contrato'}
              </Button>
              {contract && (
                <Button
                  variant='outline'
                  colorScheme='red'
                  onClick={confirm.onOpen}
                  isLoading={isDeleting}
                >
                  Eliminar Contrato
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
                  Eliminar contrato
                </AlertDialogHeader>
                <AlertDialogBody>
                  Se eliminará el contrato de {contract?.business.name}. Para
                  terminarlo sin perder el historial, ponle una fecha de fin.
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
