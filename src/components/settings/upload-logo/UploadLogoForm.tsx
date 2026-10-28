import { Button, Flex, SimpleGrid, Text, Image } from '@chakra-ui/react';
import { useQueryClient } from '@tanstack/react-query';
import { Form, Formik, FormikHelpers } from 'formik';
import { useRouter } from 'next/navigation';
import React from 'react';
import * as Yup from 'yup';
import { FormSectionTitle } from '@/components/ui/form/FormSection';
import { toaster } from '@/components/ui/toaster';
import { qk } from '@/lib/queryKeys';
import { useUploadExporterLogo } from '../../../hooks/settings/uploadExporterLogo';
import { useExporter } from '../../../hooks/useUserProfile';
import { serverErrorMessage } from '../../../utils/serverErrorMessage';
import UploadLogoFile from '../../producer/UploadLogoFile';

const SUPPORTED_FORMATS = [
  'image/jpeg',
  'image/png',
  'image/gif',
  'image/bmp',
  'image/webp',
  'image/jpg',
];

interface ValuesProps {
  exporterId: number | '';
  logoImg: File | null;
}

const initialValues: ValuesProps = {
  exporterId: '',
  logoImg: null,
};

const validationSchema = Yup.object().shape({
  logoImg: Yup.mixed()
    .required('Se requiere una imagen')
    .test('fileFormat', 'Formato no soportado', (value) => {
      return value && SUPPORTED_FORMATS.includes((value as File).type);
    }),
});

const UploadLogoForm = (): React.JSX.Element => {
  const router = useRouter();
  const { user } = useExporter();
  const { uploadExporterLogo, isPending: isLoading } = useUploadExporterLogo();
  const queryClient = useQueryClient();

  const onSubmit = async (
    values: ValuesProps,
    formikHelpers: FormikHelpers<ValuesProps>
  ): Promise<void> => {
    if (values.logoImg) {
      uploadExporterLogo(
        {
          logoImg: values.logoImg,
          exporterId: String(user?.exporterDetails.id) || '',
        },
        {
          onError: (error) => {
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
              description: 'Puede tardar unos segundos',
              type: 'success',
              duration: 5000,
              closable: true,
            });

            queryClient.invalidateQueries({
              queryKey: qk('exporter'),
            });
            formikHelpers.resetForm();
            router.push('/dashboard');
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
            <FormSectionTitle>Cambia tu logo de exportadora</FormSectionTitle>
            {user?.exporterDetails.logoUrl ? (
              <Image
                src={user.exporterDetails.logoUrl}
                alt='Logo de la empresa'
                boxSize='100px'
                objectFit='cover'
                my={2}
                mx={'auto'}
              />
            ) : (
              <Text mt={4} fontStyle='italic'>
                Logo no disponible
              </Text>
            )}

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
