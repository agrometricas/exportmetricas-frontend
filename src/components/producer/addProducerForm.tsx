import {
  Box,
  Button,
  Divider,
  Flex,
  Heading,
  SimpleGrid,
} from '@chakra-ui/react';
import { FieldArray, Form, Formik } from 'formik';
import { useSubmitProducer } from './hooks/useSubmitProducer';
import { FARM_CODE_LABELS } from '../../utils/farmCodes';
import InputFieldCitySelect from '../location/InputFieldCitySelect';
import InputFieldCountrySelect from '../location/InputFieldCountrySelect';
import InputFieldProvinceSelect from '../location/InputFieldProvinceSelect';
import InputFieldNumber from '../ui/form/InputFieldNumber';
import InputFieldSelector from '../ui/form/InputFieldSelector';
import InputFieldText from '../ui/form/InputFieldText';
import InputFieldCertificateMultiSelect from '../utils/InputFieldCertificateMultiSelect';

export default function AddProducerForm(): React.JSX.Element {
  const { onSubmit, initialValues, validationSchema, isLoading } =
    useSubmitProducer();
  const ContractOpt = [
    { name: 'FOB (FREE ON BOARD)', id: 'FOB' },
    { name: 'FAS (FREE ALONGSIDE SHIP)', id: 'FAS' },
    { name: 'SPOT (ES VENTA AL CORTO PLAZO)', id: 'SPOT' },
  ];

  const FruitTypeOpt = [
    { name: 'Convencional', id: 'Convencional' },
    { name: 'Orgánica', id: 'Orgánica' },
  ];

  return (
    <Formik
      initialValues={initialValues}
      onSubmit={onSubmit}
      validationSchema={validationSchema}
    >
      {({ values }) => (
        <Form>
          <Flex flexDirection='column' gap={2}>
            <Flex justify='space-between'>
              <Heading fontSize={'2xl'} p={'12px'}>
                Productor
              </Heading>
            </Flex>

            <SimpleGrid columns={{ base: 1, sm: 2 }} spacing={4}>
              <InputFieldText name={'businessName'} label={'Razon Social'} />
              <InputFieldText name={'businessId'} label={'RUC'} />
              <InputFieldText name={'email'} label={'Email'} />
              <InputFieldSelector
                name={'contractType'}
                label={'Tipo de Contrato'}
                options={ContractOpt}
              />
              <InputFieldCountrySelect
                name={'countryId'}
                label={'País'}
                placeholder={'Seleccione el país'}
              />
              <InputFieldProvinceSelect
                name={'provinceId'}
                label={'Provincia'}
                placeholder={'Seleccione la provincia'}
                countryId={values.countryId || undefined}
              />
              <InputFieldCitySelect
                name={'cityId'}
                label={'Ciudad'}
                placeholder={'Seleccione la ciudad'}
                provinceId={values.provinceId || undefined}
              />
              <InputFieldText name={'address'} label={'Dirección'} />
            </SimpleGrid>

            <Heading fontSize={'2xl'} p={'16px'}>
              Finca
            </Heading>
            <Divider mb={'16px'} />

            <SimpleGrid columns={{ base: 1, sm: 2 }} spacing={4}>
              <InputFieldText name={'businesses[0].name'} label={'Nombre'} />
              <InputFieldNumber
                name={'businesses[0].area'}
                label={'Área'}
                unit='ha'
                isDecimal
              />
              <InputFieldText
                name={'businesses[0].codeMAGAP'}
                label={FARM_CODE_LABELS.MAGAP}
              />
              <InputFieldText
                name={'businesses[0].codeAGROCALIDAD'}
                label={FARM_CODE_LABELS.AGROCALIDAD}
              />
              <InputFieldSelector
                name={'businesses[0].fruitType'}
                label={'Tipo de Fruta'}
                options={FruitTypeOpt}
              />
              <InputFieldCountrySelect
                name={'businesses[0].countryId'}
                label={'País'}
                placeholder={'Seleccione el país'}
              />
              <InputFieldProvinceSelect
                name={'businesses[0].provinceId'}
                label={'Provincia'}
                placeholder={'Seleccione la provincia'}
                countryId={values.businesses[0].countryId || undefined}
              />
              <InputFieldCitySelect
                name={'businesses[0].cityId'}
                label={'Ciudad'}
                placeholder={'Seleccione la ciudad'}
                provinceId={values.businesses[0].provinceId || undefined}
              />
              <InputFieldText
                name={'businesses[0].address'}
                label={'Dirección'}
              />
              <InputFieldCertificateMultiSelect
                name={'businesses[0].certificates'}
                label={'Certificados'}
                placeholder='Seleccione certificados'
              />
              <InputFieldNumber
                name={'businesses[0].latitude'}
                label={'Latitud'}
                isGeo={true}
                unit='°'
              />
              <InputFieldNumber
                name={'businesses[0].longitude'}
                label={'Longitud'}
                isGeo={true}
                unit='°'
              />
            </SimpleGrid>

            <Heading fontSize={'2xl'} p={'16px'}>
              Códigos de Finca
            </Heading>
            <Divider mb={'16px'} />

            <FieldArray name='businesses[0].businessCodes'>
              {({ push, remove }) => (
                <>
                  <SimpleGrid columns={{ base: 1, sm: 2 }} spacing={4}>
                    {values.businesses[0].businessCodes.map(
                      (_businessCode, index) => (
                        <InputFieldText
                          key={index}
                          name={`businesses[0].businessCodes[${index}].code`}
                          label={'Código'}
                          isDisabledRemove={
                            values.businesses[0].businessCodes.length === 1
                          }
                          onClickRemove={() => {
                            remove(index);
                          }}
                        />
                      )
                    )}
                    {values.businesses[0].businessCodes.length % 2 !== 0 && (
                      <Box></Box>
                    )}
                    <Box></Box>
                    <Button onClick={() => push({ code: '' })} mb='10px'>
                      Agregar Código
                    </Button>
                  </SimpleGrid>
                </>
              )}
            </FieldArray>

            <Heading fontSize={'2xl'} p={'16px'}>
              Contactos
            </Heading>
            <Divider mb={'16px'} />

            <FieldArray name='businesses[0].contacts'>
              {({ push, remove }) => (
                <>
                  {values.businesses[0].contacts.map((_contact, index) => (
                    <div key={index}>
                      <SimpleGrid columns={{ base: 1, sm: 2 }} spacing={4}>
                        <InputFieldText
                          name={`businesses[0].contacts[${index}].name`}
                          label={'Nombre'}
                        />
                        <InputFieldText
                          name={`businesses[0].contacts[${index}].role`}
                          label={'Rol'}
                        />
                        <InputFieldText
                          name={`businesses[0].contacts[${index}].email`}
                          label={'Email'}
                        />
                        <InputFieldText
                          name={`businesses[0].contacts[${index}].phone`}
                          label={'Teléfono'}
                        />
                        <Box></Box>
                        <Button
                          variant='solid'
                          colorScheme='red'
                          isDisabled={
                            values.businesses[0].contacts.length === 1
                          }
                          onClick={() => remove(index)}
                        >
                          Eliminar Contacto
                        </Button>
                      </SimpleGrid>
                      <Divider
                        mt={'16px'}
                        mb={'8px'}
                        borderWidth={'2px'}
                        variant={'dashed'}
                      />
                    </div>
                  ))}
                  <SimpleGrid columns={{ base: 1, sm: 2 }} spacing={4}>
                    <Box></Box>
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
