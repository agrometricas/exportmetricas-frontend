import {
  Box,
  Button,
  Divider,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  IconButton,
  Input,
  SimpleGrid,
  Text,
  useToast,
} from '@chakra-ui/react';
import { FieldArray, Form, Formik, FormikHelpers } from 'formik';
import { useRouter } from 'next/navigation';
import React from 'react';
import { FiPlus, FiTrash2 } from 'react-icons/fi';
import { useQueryClient } from 'react-query';
import {
  EditBusinessValues,
  editBusinessBody,
  editBusinessSchema,
  emptyContact,
  valuesFromBusiness,
} from './editBusiness';
import { useUpdateBusiness } from '../../../hooks/business/updateBusiness';
import { BusinessDetail } from '../../../types/merchant/businessDetail';
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
  const toast = useToast();
  const router = useRouter();
  const queryClient = useQueryClient();
  const { mutate: save, isLoading } = useUpdateBusiness();

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
          toast({
            title: 'No se pudo guardar la finca',
            description: serverErrorMessage(error),
            status: 'error',
            duration: 6000,
            isClosable: true,
          });
        },
        onSuccess: () => {
          toast({
            title: 'Finca actualizada',
            status: 'success',
            duration: 5000,
            isClosable: true,
          });
          queryClient.invalidateQueries('businesses');
          queryClient.invalidateQueries('business');
          router.push(LIST_PATH);
        },
      }
    );
  };

  return (
    <Formik
      initialValues={valuesFromBusiness(business)}
      onSubmit={onSubmit}
      validationSchema={editBusinessSchema}
      enableReinitialize
    >
      {({ values, errors, setFieldValue }) => (
        <Form>
          <Flex flexDirection='column' gap={3}>
            <Heading fontSize='2xl' p='12px'>
              Finca
            </Heading>
            <Divider mb='16px' />
            <SimpleGrid columns={{ base: 1, sm: 2 }} spacing={5}>
              <FormControl>
                <FormLabel fontSize='sm' mb='8px'>
                  Productor
                </FormLabel>
                <Input
                  isReadOnly
                  value={business.merchant?.businessName ?? '—'}
                />
              </FormControl>
              <InputFieldPlain name='name' label='Nombre' />
              <InputFieldPlain
                name='area'
                label='Área'
                unit='ha'
                inputMode='decimal'
              />
              <InputFieldSelector
                name='fruitType'
                label='Tipo de Fruta'
                options={FRUIT_TYPES}
              />
              <InputFieldPlain name='codeMAGAP' label='Código MAGAP' />
              <InputFieldPlain
                name='codeAGROCALIDAD'
                label='Código AGROCALIDAD'
              />
              <InputFieldCertificateMultiSelect
                name='certificates'
                label='Certificados'
                placeholder='Seleccione certificados'
              />
            </SimpleGrid>

            <Heading fontSize='2xl' p='16px'>
              Ubicación
            </Heading>
            <Divider mb='16px' />
            <SimpleGrid columns={{ base: 1, sm: 2 }} spacing={5}>
              <InputFieldCountrySelect
                name='countryId'
                label='País'
                placeholder='Seleccione el país'
                onChange={(country) => {
                  setFieldValue('countryId', country?.id || '');
                  setFieldValue('provinceId', '');
                  setFieldValue('cityId', '');
                }}
              />
              <InputFieldProvinceSelect
                name='provinceId'
                label='Provincia'
                placeholder='Seleccione la provincia'
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
                placeholder='Seleccione la ciudad'
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

            <Heading fontSize='2xl' p='16px'>
              Códigos de Finca
            </Heading>
            <Divider mb='16px' />
            <FieldArray name='businessCodes'>
              {({ push, remove }) => (
                <Flex direction='column' gap={3}>
                  <SimpleGrid columns={{ base: 1, sm: 2 }} spacing={5}>
                    {values.businessCodes.map((code, index) => (
                      <Flex key={code.id ?? `new-${index}`} gap={2}>
                        <InputFieldPlain
                          name={`businessCodes[${index}].code`}
                          placeholder='Código'
                        />
                        <IconButton
                          aria-label={`Quitar el código ${index + 1}`}
                          icon={<FiTrash2 />}
                          variant='ghost'
                          colorScheme='red'
                          isDisabled={
                            values.businessCodes.length === 1 && !!code.id
                          }
                          onClick={() => remove(index)}
                        />
                      </Flex>
                    ))}
                  </SimpleGrid>
                  {typeof errors.businessCodes === 'string' && (
                    <Text color='red.500' fontSize='sm'>
                      {errors.businessCodes}
                    </Text>
                  )}
                  <Button
                    alignSelf='flex-start'
                    leftIcon={<FiPlus />}
                    variant='outline'
                    colorScheme='green'
                    onClick={() => push({ code: '' })}
                  >
                    Agregar Código
                  </Button>
                </Flex>
              )}
            </FieldArray>

            <Heading fontSize='2xl' p='16px'>
              Contactos
            </Heading>
            <Divider mb='16px' />
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
                      <SimpleGrid columns={{ base: 1, sm: 2 }} spacing={4}>
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
                          colorScheme='red'
                          leftIcon={<FiTrash2 />}
                          isDisabled={
                            values.contacts.length === 1 && !!contact.id
                          }
                          onClick={() => remove(index)}
                        >
                          Quitar Contacto
                        </Button>
                      </Flex>
                    </Box>
                  ))}
                  {typeof errors.contacts === 'string' && (
                    <Text color='red.500' fontSize='sm'>
                      {errors.contacts}
                    </Text>
                  )}
                  <Button
                    alignSelf='flex-start'
                    leftIcon={<FiPlus />}
                    variant='outline'
                    colorScheme='green'
                    onClick={() => push(emptyContact)}
                  >
                    Agregar Contacto
                  </Button>
                </Flex>
              )}
            </FieldArray>

            <Button
              mt='12px'
              type='submit'
              colorScheme='teal'
              isLoading={isLoading}
            >
              Guardar Cambios
            </Button>
          </Flex>
        </Form>
      )}
    </Formik>
  );
}
