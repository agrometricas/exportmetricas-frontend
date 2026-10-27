import { Button, Flex, SimpleGrid } from '@chakra-ui/react';
import { Form, Formik, FormikHelpers } from 'formik';
import { useRouter } from 'next/navigation';
import React from 'react';
import { useQueryClient } from 'react-query';
import * as Yup from 'yup';
import { FormSectionTitle } from '@/components/ui/form/FormSection';
import { toaster } from '@/components/ui/toaster';
import SelectProducer from './SelectProducer';
import UploadLogoFile from './UploadLogoFile';
import { useUploadMerchantLogo } from '../../hooks/merchants/uploadMerchantLogo';
import { serverErrorMessage } from '../../utils/serverErrorMessage';

const SUPPORTED_FORMATS = [
  'image/jpeg',
  'image/png',
  'image/gif',
  'image/bmp',
  'image/webp',
  'image/jpg',
];

interface ValuesProps {
  merchantId: number | '';
  logoImg: File | null;
}

const initialValues: ValuesProps = {
  merchantId: '',
  logoImg: null,
};

const validationSchema = Yup.object().shape({
  merchantId: Yup.number().required('Requerido'),
  logoImg: Yup.mixed()
    .required('Se requiere una imagen')
    .test('fileFormat', 'Formato no soportado', (value) => {
      return value && SUPPORTED_FORMATS.includes((value as File).type);
    }),
});

const UploadLogoForm = (): React.JSX.Element => {
  const router = useRouter();
  const { uploadMerchantLogo, isLoading } = useUploadMerchantLogo();
  const queryClient = useQueryClient();

  const onSubmit = async (
    values: ValuesProps,
    formikHelpers: FormikHelpers<ValuesProps>
  ): Promise<void> => {
    if (values.logoImg) {
      uploadMerchantLogo(
        {
          logoImg: values.logoImg,
          merchantId: String(values.merchantId),
        },
        {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          onError: (error: any) => {
            const statusCode = error.response?.status;
            {
              toaster.create({
                title: 'No se pudo guardar',
                description: serverErrorMessage(error),
                type: 'error',
                duration: 5000,
                closable: true,
              });

              if (statusCode === 401) {
                router.push('/api/auth/signout');
              }
            }
          },
          onSuccess: async () => {
            toaster.create({
              title: 'Imagen Subida con Éxito',
              type: 'success',
              duration: 5000,
              closable: true,
            });

            queryClient.invalidateQueries('merchants');
            formikHelpers.resetForm();
            router.push('/dashboard/producer/producers');
          },
        }
      );
    }
  };

  return (
    <Formik
      initialValues={initialValues}
      onSubmit={onSubmit}
      validationSchema={validationSchema}
    >
      {() => (
        <Form>
          <Flex flexDirection='column' gap={3}>
            <FormSectionTitle>Seleccione el Productor</FormSectionTitle>
            <SelectProducer name={'merchantId'} />

            <FormSectionTitle>Subir Logo</FormSectionTitle>

            <UploadLogoFile name={'logoImg'} />
          </Flex>
          <SimpleGrid columns={{ base: 1, sm: 1 }}>
            <Button
              mt='12px'
              py='8px'
              px='16px'
              type='submit'
              colorPalette='green'
              loading={isLoading}
            >
              Subir Imagen
            </Button>
          </SimpleGrid>
        </Form>
      )}
    </Formik>
  );
};

export default UploadLogoForm;
