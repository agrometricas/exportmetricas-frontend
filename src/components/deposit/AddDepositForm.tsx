'use client';
import { Button, Flex, SimpleGrid, Box, Separator } from '@chakra-ui/react';
import { FieldArray, Form, Formik } from 'formik';
import React from 'react';
import {
  FormSectionTitle,
  FormActions,
} from '@/components/ui/form/FormSection';
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
            <FormSectionTitle>Depósito de contenedores</FormSectionTitle>
            <SimpleGrid columns={{ base: 1, sm: 2 }} gap={5}>
              <InputFieldText
                name='name'
                label='Nombre del depósito'
                placeholder='Nombre del deposito'
              />
              <InputFieldText
                name='code'
                label='Código'
                placeholder='Codigo del deposito'
              />
              <InputFieldText
                name='address'
                label='Dirección'
                placeholder='Direccion del deposito'
              />
              <InputFieldCountrySelect
                name='countryId'
                label='País'
                placeholder='Selecciona el país'
              />
              <InputFieldProvinceSelect
                name='provinceId'
                label='Provincia'
                placeholder='Selecciona la provincia'
                countryId={values.countryId || undefined}
              />
              <InputFieldCitySelect
                name='cityId'
                label='Ciudad'
                placeholder='Selecciona la ciudad'
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

            <FormSectionTitle>Contactos</FormSectionTitle>
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
                    Agregar contacto
                  </Button>
                </>
              )}
            </FieldArray>
            <FormActions>
              <Button type='submit' colorPalette='green' loading={isLoading}>
                Agregar
              </Button>
            </FormActions>
          </Flex>
        </Form>
      )}
    </Formik>
  );
};

export default AddDepositForm;
