import {
  Box,
  Button,
  Flex,
  Heading,
  Input,
  SimpleGrid,
  useDisclosure,
  Dialog,
  Portal,
  Separator,
  Field,
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
            <Separator mb={'16px'} />
            {contract ? (
              <SimpleGrid columns={{ base: 1, sm: 2 }} gap={5}>
                <Box>
                  <Field.Label fontSize='sm'>Productor</Field.Label>
                  <Input
                    readOnly
                    value={contract.business.merchant?.businessName ?? ''}
                  />
                </Box>
                <Box>
                  <Field.Label fontSize='sm'>Finca</Field.Label>
                  <Input readOnly value={contract.business.name} />
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
            <Separator mb={'16px'} />
            <SimpleGrid columns={{ base: 1, sm: 2 }} gap={5}>
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
            <Separator mb={'16px'} />
            <SimpleGrid columns={{ base: 1, sm: 2 }} gap={5}>
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
                colorPalette='green'
                loading={isLoading}
              >
                {contract ? 'Guardar Cambios' : 'Crear Contrato'}
              </Button>
              {contract && (
                <Button
                  variant='outline'
                  colorPalette='red'
                  onClick={confirm.onOpen}
                  loading={isDeleting}
                >
                  Eliminar Contrato
                </Button>
              )}
            </Flex>
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
                      Eliminar contrato
                    </Dialog.Header>
                    <Dialog.Body>
                      Se eliminará el contrato de {contract?.business.name}.
                      Para terminarlo sin perder el historial, ponle una fecha
                      de fin.
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
