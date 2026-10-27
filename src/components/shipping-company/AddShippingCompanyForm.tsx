'use client';
import { Button, Flex, Heading, SimpleGrid } from '@chakra-ui/react';
import { FieldArray, Form, Formik } from 'formik';
import React from 'react';
import {
  FormSectionTitle,
  FormActions,
} from '@/components/ui/form/FormSection';
import { useSubmitShippingCompany } from './hooks/useSubmitShippingCompany';
import InputFieldHarborSelect from '../harbor/InputFieldHarborSelect';
import InputFieldCountrySelect from '../location/InputFieldCountrySelect';
import InputFieldSelector from '../ui/form/InputFieldSelector';
import InputFieldText from '../ui/form/InputFieldText';

export default function AddShippingCompanyForm(): React.JSX.Element {
  const { onSubmit, initialValues, validationSchema, isLoading } =
    useSubmitShippingCompany();
  const CargoTypeOpt = [
    { name: 'Contenedores Refrigerados', id: 'Contenedores Refrigerados' },
    { name: 'Carga al Granel', id: 'Carga al Granel' },
  ];
  return (
    <Formik
      initialValues={initialValues}
      onSubmit={onSubmit}
      validationSchema={validationSchema}
    >
      {({ values }) => (
        <Form>
          <Flex flexDirection='column' gap={3}>
            <FormSectionTitle>Agregar Naviero</FormSectionTitle>
            <SimpleGrid columns={{ base: 1, sm: 2 }} gap={5}>
              <InputFieldText
                name='name'
                label='Nombre de la Naviera'
                placeholder='Nombre de la Naviera'
              />
              <InputFieldText
                name='code'
                label='Código'
                placeholder='Codigo de la Naviera'
              />
              <InputFieldText
                name='frequencies'
                label='Frecuencia'
                placeholder='Cantidad y tiempo (Ej: 1 vez a la semana)'
              />
              <InputFieldSelector
                name={'cargoType'}
                label={'Tipo de Carga'}
                options={CargoTypeOpt}
                placeholder='Seleccione el tipo de carga'
              />
              <InputFieldText
                name='trackingPlatform'
                label='Plataforma de Seguimiento'
                placeholder='Enlace a la plataforma de rastreo'
              />
              <InputFieldCountrySelect
                name={'countryId'}
                label={'País'}
                placeholder={'Seleccione el país'}
              />
            </SimpleGrid>

            <Heading fontSize='lg' p='8px'>
              Puertos de Origen y Destino
            </Heading>

            <FieldArray name='harbors'>
              {({ push, remove }) => (
                <>
                  {values.harbors.map((_, index) => (
                    <SimpleGrid
                      key={index}
                      columns={{ base: 1, sm: 4 }}
                      gap={5}
                    >
                      <InputFieldHarborSelect
                        type='Nacional'
                        name={`harbors[${index}].harborDepartureId`}
                        label='Puerto Salida'
                        placeholder='Selecciona Salida'
                      />
                      <InputFieldHarborSelect
                        type='Internacional'
                        name={`harbors[${index}].harborDestinationId`}
                        label='Puerto Destino'
                        placeholder='Selecciona Destino'
                      />
                      <InputFieldText
                        name={`harbors[${index}].estDuration`}
                        label='Tiempo Estimado'
                      />
                      <Flex alignSelf='end'>
                        <Button
                          width='100%'
                          variant='solid'
                          colorPalette='red'
                          disabled={values.harbors.length === 1}
                          onClick={() => remove(index)}
                        >
                          Eliminar
                        </Button>
                      </Flex>
                    </SimpleGrid>
                  ))}
                  <Button
                    onClick={() =>
                      push({
                        harborDepartureId: '',
                        harborDestinationId: '',
                        estDuration: '',
                      })
                    }
                    mb='10px'
                  >
                    Agregar Puertos
                  </Button>
                </>
              )}
            </FieldArray>

            <Heading fontSize='lg' p='8px'>
              Contactos
            </Heading>
            <FieldArray name='contacts'>
              {({ push, remove }) => (
                <>
                  {values.contacts.map((_, index) => (
                    <SimpleGrid
                      key={index}
                      columns={{ base: 1, sm: 4 }}
                      gap={5}
                    >
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
                Agregar
              </Button>
            </FormActions>
          </Flex>
        </Form>
      )}
    </Formik>
  );
}
