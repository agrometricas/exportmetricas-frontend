'use client';
import {
  Button,
  Flex,
  Heading,
  SimpleGrid,
  Box,
  Separator,
} from '@chakra-ui/react';
import { FieldArray, Form, Formik } from 'formik';
import React from 'react';
import {
  FormSectionTitle,
  FormActions,
} from '@/components/ui/form/FormSection';
import { useSubmitTransport } from './hooks/useSubmitTransport';
import InputFieldCertificationMultiSelect from './InputFieldCertificationMultiSelect';
import CheckboxForm from '../ui/form/CheckboxForm';
import InputFieldText from '../ui/form/InputFieldText';

const AddTransportForm: React.FC = () => {
  const { onSubmit, initialValues, validationSchema, isLoading } =
    useSubmitTransport();

  return (
    <Formik
      initialValues={initialValues}
      onSubmit={onSubmit}
      validationSchema={validationSchema}
    >
      {({ values }) => (
        <Form>
          <Flex flexDirection='column' gap={3}>
            <FormSectionTitle>Transporte</FormSectionTitle>

            <SimpleGrid columns={{ base: 1, sm: 2 }} gap={5}>
              <InputFieldText
                name='name'
                label='Nombre de la Compañía de Transporte'
                placeholder='Nombre del Transporte'
              />
              <InputFieldText
                name='ruc'
                label='RUC'
                placeholder='RUC del Transporte'
              />
              <InputFieldText
                name='address'
                label='Dirección'
                placeholder='Dirección de Referencia'
              />
              <InputFieldCertificationMultiSelect
                name='certifications'
                label='Certificaciones'
                placeholder='Selecciona los certificados'
              />
              <CheckboxForm
                name='satelliteTracking'
                label='Seguimiento satelital'
              ></CheckboxForm>
            </SimpleGrid>
            <FieldArray name='contacts'>
              {({ push, remove }) => (
                <>
                  <Heading fontSize='lg' p='8px'>
                    Contactos
                  </Heading>
                  {values.contacts.map((_, index) => (
                    <Box key={index}>
                      <SimpleGrid columns={{ base: 1, sm: 4 }} gap={5}>
                        <InputFieldText
                          name={`contacts[${index}].name`}
                          label='Nombre'
                        />
                        <InputFieldText
                          name={`contacts[${index}].email`}
                          label='Correo'
                        />
                        <InputFieldText
                          name={`contacts[${index}].phone`}
                          label='Teléfono'
                        />
                        <Flex alignSelf='end'>
                          <Button
                            width='100%'
                            variant='solid'
                            colorPalette='red'
                            disabled={values.contacts.length === 1}
                            onClick={() => remove(index)}
                          >
                            Eliminar
                          </Button>
                        </Flex>
                      </SimpleGrid>
                      <Separator
                        mt='16px'
                        mb='8px'
                        borderWidth='2px'
                        variant='dashed'
                      />
                    </Box>
                  ))}
                  <Button
                    onClick={() => push({ name: '', email: '', phone: '' })}
                    mb='10px'
                  >
                    Agregar Contacto
                  </Button>
                </>
              )}
            </FieldArray>
            <FormActions>
              <Button type='submit' colorPalette='green' loading={isLoading}>
                Agregar Transporte
              </Button>
            </FormActions>
          </Flex>
        </Form>
      )}
    </Formik>
  );
};

export default AddTransportForm;
