import { Button, Flex, SimpleGrid } from '@chakra-ui/react';
import { useQueryClient } from '@tanstack/react-query';
import { Form, Formik, FormikHelpers } from 'formik';
import { useRouter } from 'next/navigation';
import React from 'react';
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
  const { uploadMerchantLogo, isPending: isLoading } = useUploadMerchantLogo();
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
            {
              toaster.create({
                title: 'No se pudo guardar',
                description: serverErrorMessage(error),
                type: 'error',
                duration: 5000,
                closable: true,
              });
            }
          },
          onSuccess: async () => {
            toaster.create({
              title: 'Imagen subida con éxito',
              type: 'success',
              duration: 5000,
              closable: true,
            });

            queryClient.invalidateQueries({
              queryKey: ['merchants'],
            });
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
            <FormSectionTitle>Selecciona el productor</FormSectionTitle>
            <SelectProducer name={'merchantId'} />

            <FormSectionTitle>Subir logo</FormSectionTitle>

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
              Subir imagen
            </Button>
          </SimpleGrid>
        </Form>
      )}
    </Formik>
  );
};

export default UploadLogoForm;
