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
  FormErrorMessage,
  FormLabel,
  Heading,
  HStack,
  IconButton,
  Input,
  InputGroup,
  InputRightElement,
  SimpleGrid,
  Text,
  useColorModeValue,
  useDisclosure,
} from '@chakra-ui/react';
import { FieldArray, Form, Formik, useField } from 'formik';
import React, { useRef } from 'react';
import { FiPlus, FiTrash2 } from 'react-icons/fi';
import { useSubmitShippingContract } from './hooks/useSubmitShippingContract';
import { emptyRoute } from './schemas/shippingContract.schema';
import { ShippingContractResponse } from '../../types/shippingContract';
import InputFieldHarborSelect from '../harbor/InputFieldHarborSelect';
import InputFieldShippingCompanySelect from '../shipping-company/InputFieldShippingCompanySelect';
import InputFieldDayDate from '../ui/form/InputFieldDayDate';

// A plain text input: the shared number fields drop the decimal point while
// typing and lose their value when a row of the list above them is removed.
function TextField({
  name,
  label,
  unit,
  inputMode,
  placeholder,
}: {
  name: string;
  label: string;
  unit?: string;
  inputMode?: 'decimal' | 'numeric' | 'text';
  placeholder?: string;
}): React.JSX.Element {
  const [field, meta] = useField<string>(name);
  return (
    <FormControl isInvalid={!!meta.error && meta.touched}>
      <FormLabel fontSize='sm' mb='8px'>
        {label}
      </FormLabel>
      <InputGroup>
        <Input
          {...field}
          inputMode={inputMode}
          placeholder={placeholder ?? label}
          pr={unit ? '110px' : undefined}
        />
        {unit && (
          <InputRightElement
            pointerEvents='none'
            color='gray.500'
            width='auto'
            pr='12px'
          >
            {unit}
          </InputRightElement>
        )}
      </InputGroup>
      <FormErrorMessage>{meta.error}</FormErrorMessage>
    </FormControl>
  );
}

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
            <Divider mb='16px' />
            <SimpleGrid columns={{ base: 1, sm: 2 }} spacing={5}>
              {contract ? (
                <Box>
                  <FormLabel fontSize='sm'>Naviera</FormLabel>
                  <Input isReadOnly value={contract.shippingCompany.name} />
                </Box>
              ) : (
                <InputFieldShippingCompanySelect
                  name='shippingCompanyId'
                  label='Naviera'
                  placeholder='Seleccione la naviera'
                />
              )}
              <TextField
                name='reference'
                label='Referencia (opcional)'
                placeholder='Número o nombre del contrato'
              />
            </SimpleGrid>

            <Heading fontSize='2xl' p='16px'>
              Vigencia
            </Heading>
            <Divider mb='16px' />
            <SimpleGrid columns={{ base: 1, sm: 2 }} spacing={5}>
              <InputFieldDayDate name='startDate' label='Fecha de Inicio' />
              <InputFieldDayDate name='endDate' label='Fecha de Fin' />
            </SimpleGrid>

            <Heading fontSize='2xl' p='16px'>
              Rutas y Costos
            </Heading>
            <Divider mb='16px' />
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
                            icon={<FiTrash2 />}
                            size='sm'
                            variant='ghost'
                            colorScheme='red'
                            onClick={() => remove(index)}
                          />
                        )}
                      </HStack>
                      <SimpleGrid columns={{ base: 1, md: 2 }} spacing={5}>
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
                        <TextField
                          name={`routes[${index}].costPerContainer`}
                          label='Costo por Contenedor'
                          unit='USD/cont.'
                          inputMode='decimal'
                        />
                        <TextField
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
                    leftIcon={<FiPlus />}
                    variant='outline'
                    colorScheme='green'
                    onClick={() => push(emptyRoute)}
                  >
                    Agregar Ruta
                  </Button>
                </Flex>
              )}
            </FieldArray>

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
                  Eliminar contrato naviero
                </AlertDialogHeader>
                <AlertDialogBody>
                  Se eliminará el contrato de {contract?.shippingCompany.name}{' '}
                  con todas sus rutas. Si solo dejó de regir, mejor cámbiale la
                  fecha de fin y conserva el historial de precios.
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
