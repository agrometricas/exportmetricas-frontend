'use client';
import { Box, Button, Flex, SimpleGrid, Separator } from '@chakra-ui/react';
import { FieldArray, Form, Formik } from 'formik';
import React from 'react';
import {
  FormSectionTitle,
  FormActions,
} from '@/components/ui/form/FormSection';
import { useSubmitHarbor } from './hooks/useSubmitHarbor';
import InputFieldCitySelect from '../location/InputFieldCitySelect';
import InputFieldCountrySelect from '../location/InputFieldCountrySelect';
import InputFieldProvinceSelect from '../location/InputFieldProvinceSelect';
import CheckboxForm from '../ui/form/CheckboxForm';
import InputFieldMultiSelect from '../ui/form/InputFieldMultiSelect';
import InputFieldNumber from '../ui/form/InputFieldNumber';
import InputFieldSelector from '../ui/form/InputFieldSelector';
import InputFieldText from '../ui/form/InputFieldText';

const typesOpt = [
  { name: 'Nacional (Salida)', id: 'Nacional' },
  { name: 'Internacional (Destino)', id: 'Internacional' },
];

const AddHarborForm: React.FC = () => {
  const { onSubmit, initialValues, validationSchema, isLoading } =
    useSubmitHarbor();

  return (
    <Formik
      initialValues={initialValues}
      onSubmit={onSubmit}
      validationSchema={validationSchema}
    >
      {({ values, setFieldValue }) => (
        <Form>
          <Flex flexDirection='column' gap={3}>
            <FormSectionTitle>Puerto salida/destino</FormSectionTitle>

            <SimpleGrid columns={{ base: 1, sm: 2 }} gap={5}>
              <InputFieldSelector name='type' label='Tipo' options={typesOpt} />
              <InputFieldText name='name' label='Nombre del puerto' />
              <InputFieldText name='code' label='Código' />
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
              <InputFieldText name='location' label='Ubicación' />
              <InputFieldText name='address' label='Dirección' />
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
            <InputFieldMultiSelect
              name='daysOfOperation'
              label='Días de operación'
              options={[
                { value: 'Lunes', label: 'Lunes' },
                { value: 'Martes', label: 'Martes' },
                { value: 'Miércoles', label: 'Miércoles' },
                { value: 'Jueves', label: 'Jueves' },
                { value: 'Viernes', label: 'Viernes' },
                { value: 'Sabado', label: 'Sábado' },
                { value: 'Domingo', label: 'Domingo' },
              ]}
              placeholder='Selecciona los días de operación'
            />

            <FormSectionTitle>Contactos</FormSectionTitle>
            <FieldArray name='contacts'>
              {({ push, remove }) => (
                <>
                  {values.contacts.map((_, index) => (
                    <div key={index}>
                      <SimpleGrid columns={{ base: 1, sm: 2 }} gap={5}>
                        <InputFieldText
                          name={`contacts[${index}].name`}
                          label='Nombre'
                        />
                        <InputFieldText
                          name={`contacts[${index}].web`}
                          label='Sitio web'
                        />
                        <InputFieldText
                          name={`contacts[${index}].email`}
                          label='Email'
                        />
                        <InputFieldText
                          name={`contacts[${index}].phone`}
                          label='Teléfono'
                        />
                        <Box />
                        <Button
                          variant='solid'
                          colorPalette='red'
                          disabled={values.contacts.length === 1}
                          onClick={() => remove(index)}
                        >
                          Eliminar contacto
                        </Button>
                      </SimpleGrid>
                      <Separator
                        mt='16px'
                        mb='8px'
                        borderWidth='2px'
                        variant='dashed'
                      />
                    </div>
                  ))}
                  <SimpleGrid columns={{ base: 1, sm: 2 }} gap={5}>
                    <Box />
                    <Button
                      onClick={() =>
                        push({ name: '', web: '', email: '', phone: '' })
                      }
                    >
                      Agregar contacto
                    </Button>
                  </SimpleGrid>
                </>
              )}
            </FieldArray>

            <FormActions>
              <Button type='submit' colorPalette='green' loading={isLoading}>
                Crear puerto
              </Button>
            </FormActions>
          </Flex>
        </Form>
      )}
    </Formik>
  );
};

export default AddHarborForm;
