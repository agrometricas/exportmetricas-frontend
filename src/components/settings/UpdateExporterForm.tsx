import { Button, Flex, SimpleGrid, Text, Badge, Box } from '@chakra-ui/react';
import { Formik, Form, FormikHelpers } from 'formik';
import { useParams, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import * as Yup from 'yup';
import { FormSectionTitle, FormActions } from '@/components/ui/form/FormSection';
import { toaster } from '@/components/ui/toaster';
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
  const { idUser: exporterId } = useParams<{ idUser: string }>();
  const { updateExporter, isPending: isLoading } = useUpdateExporter();

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
    const { ...exporterData } = values;

    try {
      await updateExporter({ ...exporterData, exporterId });
      toaster.create({
        title: 'Exportadora actualizada con éxito',
        type: 'success',
        duration: 5000,
        closable: true,
      });
      formikHelpers.resetForm();
      router.push(`/dashboard/user/${exporterId}`);
    } catch (error) {
      toaster.create({
        title: 'Error al actualizar',
        description: serverErrorMessage(error),
        type: 'error',
        duration: 5000,
        closable: true,
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
            <SimpleGrid columns={{ base: 1, sm: 2 }} gap={4}>
              <Box display='flex' flexDirection='column' gap={7}>
                <FormSectionTitle>
                  Información general
                </FormSectionTitle>

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
                    colorPalette={
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
                  <strong>Estado de cuenta:</strong>{' '}
                  <Badge
                    ml={2}
                    colorPalette={
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
                <FormSectionTitle>
                  Ubicación
                </FormSectionTitle>
                <InputFieldCountrySelect
                  name={'countryId'}
                  label={'País'}
                  placeholder={'Selecciona el país'}
                  onChange={(newCountry) => {
                    setFieldValue('countryId', newCountry?.id || '');
                    setFieldValue('provinceId', '');
                    setFieldValue('cityId', '');
                  }}
                />
                <InputFieldProvinceSelect
                  name={'provinceId'}
                  label={'Provincia'}
                  placeholder={'Selecciona la provincia'}
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
                  placeholder={'Selecciona la ciudad'}
                  provinceId={values.provinceId || undefined}
                  resetOnParentChange={false}
                />
                <InputFieldText name={'address'} label={'Dirección'} />
              </Box>
            </SimpleGrid>

            <FormActions><Button
              type='submit'
              colorPalette='green'
              loading={isLoading}
            >
              Guardar cambios
            </Button></FormActions>
          </Flex>
        </Form>
      )}
    </Formik>
  );
};

export default UpdateExporterForm;
