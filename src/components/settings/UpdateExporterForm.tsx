import {
  Button,
  Flex,
  Heading,
  SimpleGrid,
  useToast,
  Text,
  Badge,
  Box,
} from '@chakra-ui/react';
import { Formik, Form, FormikHelpers } from 'formik';
import { useParams, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import * as Yup from 'yup';
import { useUpdateExporter } from '../../hooks/settings/updateExporter';
import { formatDayMonthYear } from '../../utils/dayMonthYear';
import { serverErrorMessage } from '../../utils/serverErrorMessage';
import InputFieldCitySelect from '../location/InputFieldCitySelect';
import InputFieldCountrySelect from '../location/InputFieldCountrySelect';
import InputFieldProvinceSelect from '../location/InputFieldProvinceSelect';
import InputFieldText from '../ui/form/InputFieldText';

interface ValuesProps {
  address: string;
  countryId: number | '';
  provinceId: number | '';
  cityId: number | '';
}

interface ExporterDetails {
  updatedAt: string;
  email: string;
  businessName: string;
  businessId: string;
  address?: string;

  country?: { id: number; name: string };
  province?: { id: number; name: string };
  city?: { id: number; name: string };
  onboardingStatus?: string;
  accountStatus: string;
}

interface UpdateExporterFormProps {
  exporterDetails: ExporterDetails;
}

const validationSchema = Yup.object({
  address: Yup.string()
    .transform((value) => value.trim())
    .max(50, 'Debe tener 50 caracteres o menos')
    .matches(/^[a-zA-Z0-9\s.,'-]+$/, 'Dirección no válida'),
  city: Yup.string()
    .transform((value) => value.trim())
    .max(50, 'Debe tener 50 caracteres o menos')
    .matches(/^[a-zA-Z\s]+$/, 'Solo debe contener letras y espacios'),
});

const UpdateExporterForm = ({
  exporterDetails,
}: UpdateExporterFormProps): React.JSX.Element => {
  const router = useRouter();
  const toast = useToast();
  const { idUser: exporterId } = useParams<{ idUser: string }>();
  const { updateExporter, isLoading } = useUpdateExporter();

  const [formValues, setFormValues] = useState<ValuesProps>({
    address: '',
    countryId: 1,
    provinceId: '',
    cityId: '',
  });

  useEffect(() => {
    if (exporterDetails) {
      setFormValues((prev) => ({
        ...prev,
        address: exporterDetails.address || '',
        countryId: exporterDetails.country?.id || '',
        provinceId: exporterDetails.province?.id || '',
        cityId: exporterDetails.city?.id || '',
      }));
    }
  }, [exporterDetails]);

  const onSubmit = async (
    values: ValuesProps,
    formikHelpers: FormikHelpers<ValuesProps>
  ): Promise<void> => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { ...exporterData } = values;

    try {
      await updateExporter({ ...exporterData, exporterId });
      toast({
        title: 'Exportadora Actualizada con éxito',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
      formikHelpers.resetForm();
      router.push(`/dashboard/user/${exporterId}`);
    } catch (error) {
      toast({
        title: 'Error al actualizar',
        description: serverErrorMessage(error),
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  return (
    <Formik
      initialValues={formValues}
      enableReinitialize={true}
      onSubmit={onSubmit}
      validationSchema={validationSchema}
    >
      {({ values, setFieldValue }) => (
        <Form>
          <Flex flexDirection='column' gap={2}>
            <SimpleGrid columns={{ base: 1, sm: 2 }} spacing={4}>
              <Box display='flex' flexDirection='column' gap={7}>
                <Heading fontSize={'2xl'} p={'12px'}>
                  Información General
                </Heading>

                <Text>
                  <strong>Nombre:</strong> {exporterDetails.businessName}
                </Text>
                <Text>
                  <strong>RUC:</strong> {exporterDetails.businessId}
                </Text>
                <Text>
                  <strong>Email:</strong> {exporterDetails.email}
                </Text>
                <Text>
                  <strong>Configuración inicial:</strong>{' '}
                  <Badge
                    ml={2}
                    colorScheme={
                      exporterDetails.onboardingStatus === 'done'
                        ? 'green'
                        : 'red'
                    }
                  >
                    {exporterDetails.onboardingStatus === 'done'
                      ? 'Completa'
                      : 'Pendiente'}
                  </Badge>
                </Text>
                <Text>
                  <strong>Estado de Cuenta:</strong>{' '}
                  <Badge
                    ml={2}
                    colorScheme={
                      exporterDetails.accountStatus === 'active'
                        ? 'green'
                        : 'red'
                    }
                  >
                    {exporterDetails.accountStatus === 'active'
                      ? 'Activo'
                      : 'Inactivo'}
                  </Badge>
                </Text>

                <Text>
                  <strong>Última actualización:</strong>{' '}
                  {formatDayMonthYear(exporterDetails.updatedAt)}
                </Text>
              </Box>
              <Box display='flex' flexDirection='column' gap={4}>
                <Heading fontSize={'2xl'} p={'12px'}>
                  Ubicación
                </Heading>
                <InputFieldCountrySelect
                  name={'countryId'}
                  label={'País'}
                  placeholder={'Seleccione el país'}
                  onChange={(newCountry) => {
                    setFieldValue('countryId', newCountry?.id || '');
                    setFieldValue('provinceId', '');
                    setFieldValue('cityId', '');
                  }}
                />
                <InputFieldProvinceSelect
                  name={'provinceId'}
                  label={'Provincia'}
                  placeholder={'Seleccione la provincia'}
                  countryId={values.countryId || undefined}
                  resetOnParentChange={false}
                  onChange={(newProvince) => {
                    setFieldValue('provinceId', newProvince?.id || '');
                    setFieldValue('cityId', '');
                  }}
                />
                <InputFieldCitySelect
                  name={'cityId'}
                  label={'Ciudad'}
                  placeholder={'Seleccione la ciudad'}
                  provinceId={values.provinceId || undefined}
                  resetOnParentChange={false}
                />
                <InputFieldText name={'address'} label={'Dirección'} />
              </Box>
            </SimpleGrid>

            <Button
              mt='12px'
              type='submit'
              colorScheme='teal'
              isLoading={isLoading}
            >
              Enviar
            </Button>
          </Flex>
        </Form>
      )}
    </Formik>
  );
};

export default UpdateExporterForm;
