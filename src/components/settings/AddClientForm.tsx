'use client';
import {
  Button,
  Divider,
  Flex,
  Heading,
  SimpleGrid,
  Box,
} from '@chakra-ui/react';
import { Form, Formik, FieldArray } from 'formik';
import React from 'react';
import { useSubmitClient } from './hooks/useSubmitClient';
import InputFieldIncotermMultiSelect from './InputFieldIncotermMultiSelect';
import {
  PAYMENT_UNIT_OPTIONS,
  VOLUME_PERIOD_OPTIONS,
} from '../../utils/clientTerms';
import InputFieldHarborMultiSelect from '../harbor/InputFieldHarborMultiSelect';
import InputFieldCitySelect from '../location/InputFieldCitySelect';
import InputFieldCountrySelect from '../location/InputFieldCountrySelect';
import InputFieldProvinceSelect from '../location/InputFieldProvinceSelect';
import CheckboxForm from '../ui/form/CheckboxForm';
import InputFieldPlain from '../ui/form/InputFieldPlain';
import InputFieldSelector from '../ui/form/InputFieldSelector';
import InputFieldText from '../ui/form/InputFieldText';
import InputFieldCertificateMultiSelect from '../utils/InputFieldCertificateMultiSelect';

const typesOpt = [
  { name: 'Supermercado', id: 'Supermercado' },
  { name: 'Intermediario', id: 'Intermediario' },
];

const ShippingMethodOptions = [
  { name: 'Marítimo', id: 'Marítimo' },
  { name: 'Aéreo', id: 'Aéreo' },
  { name: 'Terrestre', id: 'Terrestre' },
];

export default function AddClientForm(): React.JSX.Element {
  const { onSubmit, initialValues, validationSchema, isLoading } =
    useSubmitClient();

  return (
    <Formik
      initialValues={initialValues}
      onSubmit={onSubmit}
      validationSchema={validationSchema}
    >
      {({ values }) => (
        <Form>
          <Flex flexDirection='column' gap={3} width='100%'>
            <Flex justify='space-between'>
              <Heading fontSize='2xl' p='12px'>
                Cliente
              </Heading>
            </Flex>
            <Divider mb='16px' />

            <SimpleGrid columns={{ base: 1, sm: 2 }} spacing={5}>
              <InputFieldText name='businessName' label='Nombre/Razón Social' />
              <InputFieldText name='businessId' label='RUC' />
              <InputFieldText name='address' label='Dirección' />
              <InputFieldSelector name='type' label='Tipo' options={typesOpt} />
              <InputFieldText name='commercialType' label='Tipo Comercial' />
              <InputFieldText name='postalCode' label='Código Postal' />
              <InputFieldText name='email' label='Correo' />
              <InputFieldText name='phone' label='Teléfono' />
              <InputFieldText name='website' label='Sitio Web' />
              <InputFieldPlain
                name='purchaseVolumeBoxes'
                label='Volumen de Compra (cajas)'
                inputMode='numeric'
                placeholder='Por ejemplo: 100000'
              />
              <InputFieldSelector
                name='purchaseVolumePeriod'
                label='Período del Volumen'
                placeholder='Seleccione el período'
                options={VOLUME_PERIOD_OPTIONS}
              />
              <InputFieldPlain
                name='paymentTermValue'
                label='Plazo de Pago (0 es contado)'
                inputMode='numeric'
                placeholder='Por ejemplo: 30'
              />
              <InputFieldSelector
                name='paymentTermUnit'
                label='Unidad del Plazo'
                placeholder='Seleccione la unidad'
                options={PAYMENT_UNIT_OPTIONS}
              />
              <InputFieldSelector
                name={'shippingMethod'}
                label={'Método de Envío'}
                options={ShippingMethodOptions}
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
              <InputFieldHarborMultiSelect
                type='Internacional'
                name='harbors'
                label='Puerto/s'
                placeholder='Seleccione el/los puerto/s'
              />
              <InputFieldIncotermMultiSelect
                name='incoterms'
                label='Incoterms'
                placeholder='Selecciona los Incoterms acordados'
              />
              <InputFieldCertificateMultiSelect
                name={'certificates'}
                label={'Certificados'}
                placeholder='Seleccione certificados'
              />
            </SimpleGrid>

            <Heading fontSize='2xl' p='16px'>
              Contactos
            </Heading>
            <Divider mb='16px' />
            <FieldArray name='contacts'>
              {({ push, remove }) => (
                <>
                  {values.contacts.map((_, index) => (
                    <div key={index}>
                      <SimpleGrid columns={{ base: 1, sm: 2 }} spacing={5}>
                        <InputFieldText
                          name={`contacts[${index}].name`}
                          label='Nombre'
                        />
                        <InputFieldText
                          name={`contacts[${index}].role`}
                          label='Rol'
                        />
                        <InputFieldText
                          name={`contacts[${index}].email`}
                          label='Correo'
                        />
                        <InputFieldText
                          name={`contacts[${index}].phone`}
                          label='Teléfono'
                        />
                        <Box />
                        <Button
                          variant='solid'
                          colorScheme='red'
                          isDisabled={values.contacts.length === 1}
                          onClick={() => remove(index)}
                        >
                          Eliminar Contacto
                        </Button>
                      </SimpleGrid>
                      <Divider
                        mt='16px'
                        mb='8px'
                        borderWidth='2px'
                        variant='dashed'
                      />
                    </div>
                  ))}
                  <SimpleGrid columns={{ base: 1, sm: 2 }} spacing={5}>
                    <Box />
                    <Button
                      onClick={() =>
                        push({ name: '', role: '', email: '', phone: '' })
                      }
                    >
                      Agregar Contacto
                    </Button>
                  </SimpleGrid>
                </>
              )}
            </FieldArray>

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
                colorScheme='teal'
                isLoading={isLoading}
              >
                Enviar
              </Button>
            </SimpleGrid>
          </Flex>
        </Form>
      )}
    </Formik>
  );
}
