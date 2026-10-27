import {
  Box,
  Button,
  Flex,
  Heading,
  HStack,
  IconButton,
  Input,
  SimpleGrid,
  Text,
  useDisclosure,
  Dialog,
  Portal,
  Separator,
  Field,
} from '@chakra-ui/react';
import { FieldArray, Form, Formik } from 'formik';
import React, { useRef } from 'react';
import { FiPlus, FiTrash2 } from 'react-icons/fi';
import { useSubmitShippingContract } from './hooks/useSubmitShippingContract';
import { emptyRoute } from './schemas/shippingContract.schema';
import { ShippingContractResponse } from '../../types/shippingContract';
import InputFieldHarborSelect from '../harbor/InputFieldHarborSelect';
import InputFieldShippingCompanySelect from '../shipping-company/InputFieldShippingCompanySelect';
import { useColorModeValue } from '../ui/color-mode';
import InputFieldDayDate from '../ui/form/InputFieldDayDate';
import InputFieldPlain from '../ui/form/InputFieldPlain';

export default function ShippingContractForm({
  contract,
}: {
  contract?: ShippingContractResponse;
}): React.JSX.Element {
  const {
    onSubmit,
    onDelete,
    initialValues,
    validationSchema,
    isLoading,
    isDeleting,
  } = useSubmitShippingContract(contract);
  const confirm = useDisclosure();
  const cancelRef = useRef<HTMLButtonElement>(null);
  const routeBorder = useColorModeValue('gray.200', 'gray.600');

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
              Naviera
            </Heading>
            <Separator mb='16px' />
            <SimpleGrid columns={{ base: 1, sm: 2 }} gap={5}>
              {contract ? (
                <Box>
                  <Field.Label fontSize='sm'>Naviera</Field.Label>
                  <Input readOnly value={contract.shippingCompany.name} />
                </Box>
              ) : (
                <InputFieldShippingCompanySelect
                  name='shippingCompanyId'
                  label='Naviera'
                  placeholder='Seleccione la naviera'
                />
              )}
              <InputFieldPlain
                name='reference'
                label='Referencia (opcional)'
                placeholder='Número o nombre del contrato'
              />
            </SimpleGrid>

            <Heading fontSize='2xl' p='16px'>
              Vigencia
            </Heading>
            <Separator mb='16px' />
            <SimpleGrid columns={{ base: 1, sm: 2 }} gap={5}>
              <InputFieldDayDate name='startDate' label='Fecha de Inicio' />
              <InputFieldDayDate name='endDate' label='Fecha de Fin' />
            </SimpleGrid>

            <Heading fontSize='2xl' p='16px'>
              Rutas y Costos
            </Heading>
            <Separator mb='16px' />
            <FieldArray name='routes'>
              {({ push, remove }) => (
                <Flex direction='column' gap={4}>
                  {values.routes.map((_, index) => (
                    <Box
                      key={index}
                      borderWidth='1px'
                      borderColor={routeBorder}
                      borderRadius='lg'
                      p={4}
                    >
                      <HStack justify='space-between' mb={3}>
                        <Text fontWeight='semibold'>Ruta {index + 1}</Text>
                        {values.routes.length > 1 && (
                          <IconButton
                            aria-label={`Quitar la ruta ${index + 1}`}
                            size='sm'
                            variant='ghost'
                            colorPalette='red'
                            onClick={() => remove(index)}
                          >
                            <FiTrash2 />
                          </IconButton>
                        )}
                      </HStack>
                      <SimpleGrid columns={{ base: 1, md: 2 }} gap={5}>
                        <InputFieldHarborSelect
                          type='Nacional'
                          name={`routes[${index}].harborDepartureId`}
                          label='Puerto de Salida'
                          placeholder='Seleccione la salida'
                        />
                        <InputFieldHarborSelect
                          type='Internacional'
                          name={`routes[${index}].harborDestinationId`}
                          label='Puerto de Destino'
                          placeholder='Seleccione el destino'
                        />
                        <InputFieldPlain
                          name={`routes[${index}].costPerContainer`}
                          label='Costo por Contenedor'
                          unit='USD/cont.'
                          inputMode='decimal'
                        />
                        <InputFieldPlain
                          name={`routes[${index}].transitDays`}
                          label='Días de Tránsito (opcional)'
                          unit='días'
                          inputMode='numeric'
                        />
                      </SimpleGrid>
                    </Box>
                  ))}
                  {typeof errors.routes === 'string' && (
                    <Text color='red.500' fontSize='sm'>
                      {errors.routes}
                    </Text>
                  )}
                  <Button
                    alignSelf='flex-start'
                    variant='outline'
                    colorPalette='green'
                    onClick={() => push(emptyRoute)}
                  >
                    <FiPlus />
                    Agregar Ruta
                  </Button>
                </Flex>
              )}
            </FieldArray>

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
                      Eliminar contrato naviero
                    </Dialog.Header>
                    <Dialog.Body>
                      Se eliminará el contrato de{' '}
                      {contract?.shippingCompany.name} con todas sus rutas. Si
                      solo dejó de regir, mejor cámbiale la fecha de fin y
                      conserva el historial de precios.
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
