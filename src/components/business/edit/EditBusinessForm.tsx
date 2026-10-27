import {
  Box,
  Button,
  Flex,
  IconButton,
  Input,
  SimpleGrid,
  Text,
  Field,
} from '@chakra-ui/react';
import { useQueryClient } from '@tanstack/react-query';
import { FieldArray, Form, Formik, FormikHelpers } from 'formik';
import { useRouter } from 'next/navigation';
import React from 'react';
import { FiPlus, FiTrash2 } from 'react-icons/fi';
import {
  FormSectionTitle,
  FormActions,
} from '@/components/ui/form/FormSection';
import { toaster } from '@/components/ui/toaster';
import {
  EditBusinessValues,
  editBusinessBody,
  editBusinessSchema,
  emptyContact,
  valuesFromBusiness,
} from './editBusiness';
import { useUpdateBusiness } from '../../../hooks/business/updateBusiness';
import { BusinessDetail } from '../../../types/merchant/businessDetail';
import { FARM_CODE_LABELS } from '../../../utils/farmCodes';
import { serverErrorMessage } from '../../../utils/serverErrorMessage';
import InputFieldCitySelect from '../../location/InputFieldCitySelect';
import InputFieldCountrySelect from '../../location/InputFieldCountrySelect';
import InputFieldProvinceSelect from '../../location/InputFieldProvinceSelect';
import InputFieldPlain from '../../ui/form/InputFieldPlain';
import InputFieldSelector from '../../ui/form/InputFieldSelector';
import InputFieldCertificateMultiSelect from '../../utils/InputFieldCertificateMultiSelect';

const FRUIT_TYPES = [
  { name: 'Convencional', id: 'Convencional' },
  { name: 'Orgánica', id: 'Orgánica' },
];

const LIST_PATH = '/dashboard/producer/fincas';

export default function EditBusinessForm({
  business,
}: {
  business: BusinessDetail;
}): React.JSX.Element {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { mutate: save, isPending: isLoading } = useUpdateBusiness();

  const onSubmit = (
    values: EditBusinessValues,
    helpers: FormikHelpers<EditBusinessValues>
  ): void => {
    save(
      { businessId: business.id, body: editBusinessBody(values) },
      {
        onError: (error) => {
          const data = error.response?.data;
          if (data?.statusCode === 401) {
            router.push('/api/auth/signout');
            return;
          }
          if (data?.prop) {
            helpers.setFieldTouched(data.prop, true, false);
            helpers.setFieldError(data.prop, data.message);
          }
          toaster.create({
            title: 'No se pudo guardar la finca',
            description: serverErrorMessage(error),
            type: 'error',
            duration: 6000,
            closable: true,
          });
        },
        onSuccess: () => {
          toaster.create({
            title: 'Finca actualizada',
            type: 'success',
            duration: 5000,
            closable: true,
          });
          queryClient.invalidateQueries({
            queryKey: ['businesses'],
          });
          queryClient.invalidateQueries({
            queryKey: ['business'],
          });
          router.push(LIST_PATH);
        },
      }
    );
  };

  return (
    <Formik
      initialValues={valuesFromBusiness(business)}
      onSubmit={onSubmit}
      validationSchema={editBusinessSchema(business)}
      enableReinitialize
    >
      {({ values, errors, setFieldValue }) => (
        <Form>
          <Flex flexDirection='column' gap={3}>
            <FormSectionTitle>Finca</FormSectionTitle>
            <SimpleGrid columns={{ base: 1, sm: 2 }} gap={5}>
              <Field.Root>
                <Field.Label fontSize='sm' mb='8px'>
                  Productor
                </Field.Label>
                <Input
                  readOnly
                  value={business.merchant?.businessName ?? '—'}
                />
              </Field.Root>
              <InputFieldPlain name='name' label='Nombre' />
              <InputFieldPlain
                name='area'
                label='Área'
                unit='ha'
                inputMode='decimal'
              />
              <InputFieldSelector
                name='fruitType'
                label='Tipo de fruta'
                options={FRUIT_TYPES}
              />
              <InputFieldPlain
                name='codeMAGAP'
                label={FARM_CODE_LABELS.MAGAP}
              />
              <InputFieldPlain
                name='codeAGROCALIDAD'
                label={FARM_CODE_LABELS.AGROCALIDAD}
              />
              <InputFieldCertificateMultiSelect
                name='certificates'
                label='Certificados'
                placeholder='Selecciona certificados'
              />
            </SimpleGrid>

            <FormSectionTitle>Ubicación</FormSectionTitle>
            <SimpleGrid columns={{ base: 1, sm: 2 }} gap={5}>
              <InputFieldCountrySelect
                name='countryId'
                label='País'
                placeholder='Selecciona el país'
                onChange={(country) => {
                  setFieldValue('countryId', country?.id || '');
                  setFieldValue('provinceId', '');
                  setFieldValue('cityId', '');
                }}
              />
              <InputFieldProvinceSelect
                name='provinceId'
                label='Provincia'
                placeholder='Selecciona la provincia'
                countryId={values.countryId || undefined}
                resetOnParentChange={false}
                onChange={(province) => {
                  setFieldValue('provinceId', province?.id || '');
                  setFieldValue('cityId', '');
                }}
              />
              <InputFieldCitySelect
                name='cityId'
                label='Ciudad'
                placeholder='Selecciona la ciudad'
                provinceId={values.provinceId || undefined}
                resetOnParentChange={false}
              />
              <InputFieldPlain name='address' label='Dirección' />
              <InputFieldPlain
                name='latitude'
                label='Latitud'
                unit='°'
                inputMode='decimal'
              />
              <InputFieldPlain
                name='longitude'
                label='Longitud'
                unit='°'
                inputMode='decimal'
              />
            </SimpleGrid>

            <FormSectionTitle>Códigos de finca</FormSectionTitle>
            <FieldArray name='businessCodes'>
              {({ push, remove }) => (
                <Flex direction='column' gap={3}>
                  <SimpleGrid columns={{ base: 1, sm: 2 }} gap={5}>
                    {values.businessCodes.map((code, index) => (
                      <Flex key={code.id ?? `new-${index}`} gap={2}>
                        <InputFieldPlain
                          name={`businessCodes[${index}].code`}
                          placeholder='Código'
                        />
                        <IconButton
                          aria-label={`Quitar el código ${index + 1}`}
                          variant='ghost'
                          colorPalette='red'
                          disabled={
                            values.businessCodes.length === 1 && !!code.id
                          }
                          onClick={() => remove(index)}
                        >
                          <FiTrash2 />
                        </IconButton>
                      </Flex>
                    ))}
                  </SimpleGrid>
                  {typeof errors.businessCodes === 'string' && (
                    <Text color='red.fg' fontSize='sm'>
                      {errors.businessCodes}
                    </Text>
                  )}
                  <Button
                    alignSelf='flex-start'
                    variant='outline'
                    colorPalette='green'
                    onClick={() => push({ code: '' })}
                  >
                    <FiPlus />
                    Agregar Código
                  </Button>
                </Flex>
              )}
            </FieldArray>

            <FormSectionTitle>Contactos</FormSectionTitle>
            <FieldArray name='contacts'>
              {({ push, remove }) => (
                <Flex direction='column' gap={4}>
                  {values.contacts.map((contact, index) => (
                    <Box
                      key={contact.id ?? `new-${index}`}
                      borderWidth='1px'
                      borderRadius='lg'
                      p={4}
                    >
                      <SimpleGrid columns={{ base: 1, sm: 2 }} gap={4}>
                        <InputFieldPlain
                          name={`contacts[${index}].name`}
                          label='Nombre'
                        />
                        <InputFieldPlain
                          name={`contacts[${index}].role`}
                          label='Rol'
                        />
                        <InputFieldPlain
                          name={`contacts[${index}].email`}
                          label='Email'
                        />
                        <InputFieldPlain
                          name={`contacts[${index}].phone`}
                          label='Teléfono'
                          inputMode='numeric'
                        />
                      </SimpleGrid>
                      <Flex justify='flex-end' mt={2}>
                        <Button
                          size='sm'
                          variant='ghost'
                          colorPalette='red'
                          disabled={
                            values.contacts.length === 1 && !!contact.id
                          }
                          onClick={() => remove(index)}
                        >
                          <FiTrash2 />
                          Quitar Contacto
                        </Button>
                      </Flex>
                    </Box>
                  ))}
                  {typeof errors.contacts === 'string' && (
                    <Text color='red.fg' fontSize='sm'>
                      {errors.contacts}
                    </Text>
                  )}
                  <Button
                    alignSelf='flex-start'
                    variant='outline'
                    colorPalette='green'
                    onClick={() => push(emptyContact)}
                  >
                    <FiPlus />
                    Agregar Contacto
                  </Button>
                </Flex>
              )}
            </FieldArray>

            <FormActions>
              <Button type='submit' colorPalette='green' loading={isLoading}>
                Guardar Cambios
              </Button>
            </FormActions>
          </Flex>
        </Form>
      )}
    </Formik>
  );
}
