import { Box, Button, Flex, SimpleGrid, Separator } from '@chakra-ui/react';
import { FieldArray, Form, Formik } from 'formik';
import {
  FormSectionTitle,
  FormActions,
} from '@/components/ui/form/FormSection';
import { useSubmitBusiness } from './hooks/useSubmitBusiness';
import SelectProducer from './SelectProducer';
import { FARM_CODE_LABELS } from '../../utils/farmCodes';
import InputFieldCitySelect from '../location/InputFieldCitySelect';
import InputFieldCountrySelect from '../location/InputFieldCountrySelect';
import InputFieldProvinceSelect from '../location/InputFieldProvinceSelect';
import InputFieldNumber from '../ui/form/InputFieldNumber';
import InputFieldSelector from '../ui/form/InputFieldSelector';
import InputFieldText from '../ui/form/InputFieldText';
import InputFieldCertificateMultiSelect from '../utils/InputFieldCertificateMultiSelect';

export default function AddBusinessForm(): React.JSX.Element {
  const { onSubmit, initialValues, validationSchema, isLoading } =
    useSubmitBusiness();
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
          <Flex flexDirection='column' gap={3}>
            <FormSectionTitle>Seleccione el Productor</FormSectionTitle>
            <SelectProducer name={'merchant'} />

            <FormSectionTitle>Finca</FormSectionTitle>

            <SimpleGrid columns={{ base: 1, sm: 2 }} gap={5}>
              <InputFieldText name={'name'} label={'Nombre'} />
              <InputFieldNumber
                name={'area'}
                label={'Área'}
                unit='ha'
                isDecimal
              />
              <InputFieldText
                name={'codeMAGAP'}
                label={FARM_CODE_LABELS.MAGAP}
              />
              <InputFieldText
                name={'codeAGROCALIDAD'}
                label={FARM_CODE_LABELS.AGROCALIDAD}
              />
              <InputFieldSelector
                name={'fruitType'}
                label={'Tipo de Fruta'}
                options={FruitTypeOpt}
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
              <InputFieldCertificateMultiSelect
                name={'certificates'}
                label={'Certificados'}
                placeholder='Seleccione certificados'
              />
              <InputFieldNumber
                name={'latitude'}
                label={'Latitud'}
                isGeo={true}
                unit='°'
              />
              <InputFieldNumber
                name={'longitude'}
                label={'Longitud'}
                isGeo={true}
                unit='°'
              />
            </SimpleGrid>

            <FormSectionTitle>Códigos de Finca</FormSectionTitle>

            <FieldArray name='businessCodes'>
              {({ push, remove }) => (
                <>
                  <SimpleGrid columns={{ base: 1, sm: 2 }} gap={5}>
                    {values.businessCodes.map((_businessCode, index) => (
                      <InputFieldText
                        key={index}
                        name={`businessCodes[${index}].code`}
                        label={'Código'}
                        isDisabledRemove={values.businessCodes.length === 1}
                        onClickRemove={() => {
                          remove(index);
                        }}
                      />
                    ))}
                    {values.businessCodes.length % 2 !== 0 && <Box></Box>}
                    <Box></Box>
                    <Button onClick={() => push({ code: '' })} mb='10px'>
                      Agregar Código
                    </Button>
                  </SimpleGrid>
                </>
              )}
            </FieldArray>

            <FormSectionTitle>Contactos</FormSectionTitle>

            <FieldArray name='contacts'>
              {({ push, remove }) => (
                <>
                  {values.contacts.map((_contact, index) => (
                    <div key={index}>
                      <SimpleGrid columns={{ base: 1, sm: 2 }} gap={5}>
                        <InputFieldText
                          name={`contacts[${index}].name`}
                          label={'Nombre'}
                        />
                        <InputFieldText
                          name={`contacts[${index}].role`}
                          label={'Rol'}
                        />
                        <InputFieldText
                          name={`contacts[${index}].email`}
                          label={'Email'}
                        />
                        <InputFieldText
                          name={`contacts[${index}].phone`}
                          label={'Teléfono'}
                        />
                        <Box></Box>
                        <Button
                          variant='solid'
                          colorPalette='red'
                          disabled={values.contacts.length === 1}
                          onClick={() => remove(index)}
                        >
                          Eliminar Contacto
                        </Button>
                      </SimpleGrid>
                      <Separator
                        mt={'16px'}
                        mb={'8px'}
                        borderWidth={'2px'}
                        variant={'dashed'}
                      />
                    </div>
                  ))}
                  <SimpleGrid columns={{ base: 1, sm: 2 }} gap={5}>
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

            <FormActions>
              <Button type='submit' colorPalette='green' loading={isLoading}>
                Enviar
              </Button>
            </FormActions>
          </Flex>
        </Form>
      )}
    </Formik>
  );
}
