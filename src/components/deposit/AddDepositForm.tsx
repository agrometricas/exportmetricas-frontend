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
import { useSubmitDeposit } from './hooks/useSubmitDeposit';
import InputFieldCitySelect from '../location/InputFieldCitySelect';
import InputFieldCountrySelect from '../location/InputFieldCountrySelect';
import InputFieldProvinceSelect from '../location/InputFieldProvinceSelect';
import CheckboxForm from '../ui/form/CheckboxForm';
import InputFieldNumber from '../ui/form/InputFieldNumber';
import InputFieldText from '../ui/form/InputFieldText';

const AddDepositForm: React.FC = () => {
  const { onSubmit, initialValues, validationSchema, isLoading } =
    useSubmitDeposit();

  return (
    <Formik
      initialValues={initialValues}
      onSubmit={onSubmit}
      validationSchema={validationSchema}
    >
      {({ values, setFieldValue }) => (
        <Form>
          <Flex flexDirection='column' gap={3}>
            <Heading fontSize='2xl' p='12px'>
              Depósito de Contenedores
            </Heading>
            <Separator mb='16px' />
            <SimpleGrid columns={{ base: 1, sm: 2 }} gap={5}>
              <InputFieldText
                name='name'
                label='Nombre del Depósito'
                placeholder='Nombre del Deposito'
              />
              <InputFieldText
                name='code'
                label='Código'
                placeholder='Codigo del Deposito'
              />
              <InputFieldText
                name='address'
                label='Dirección'
                placeholder='Direccion del Deposito'
              />
              <InputFieldCountrySelect
                name='countryId'
                label='País'
                placeholder='Seleccione el país'
              />
              <InputFieldProvinceSelect
                name='provinceId'
                label='Provincia'
                placeholder='Seleccione la provincia'
                countryId={values.countryId || undefined}
              />
              <InputFieldCitySelect
                name='cityId'
                label='Ciudad'
                placeholder='Seleccione la ciudad'
                provinceId={values.provinceId || undefined}
              />
              <InputFieldNumber
                name='latitude'
                label='Latitud'
                isGeo
                unit='°'
              />
              <InputFieldNumber
                name='longitude'
                label='Longitud'
                isGeo
                unit='°'
              />
              <InputFieldText
                name='openTime'
                label='Hora de apertura'
                unit='HH:mm'
              />
              <InputFieldText
                name='closeTime'
                label='Hora de cierre'
                unit='HH:mm'
              />
              <Box>
                <CheckboxForm
                  name='is24Hours'
                  label='24 horas'
                  onChange={(checked) => {
                    if (checked) {
                      setFieldValue('openTime', '12:00');
                      setFieldValue('closeTime', '12:00');
                    } else {
                      setFieldValue('openTime', '');
                      setFieldValue('closeTime', '');
                    }
                  }}
                />
              </Box>
            </SimpleGrid>

            <Heading fontSize='2xl' p='12px'>
              Contactos
            </Heading>
            <Separator mb='16px' />
            <FieldArray name='contacts'>
              {({ push, remove }) => (
                <>
                  {values.contacts.map((_, index) => (
                    <div key={index}>
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
                    </div>
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
            <Button
              mt='12px'
              py='8px'
              px='16px'
              type='submit'
              colorPalette='green'
              loading={isLoading}
            >
              Agregar
            </Button>
          </Flex>
        </Form>
      )}
    </Formik>
  );
};

export default AddDepositForm;
