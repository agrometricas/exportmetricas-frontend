/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button, Flex, SimpleGrid } from '@chakra-ui/react';
import { useQueryClient } from '@tanstack/react-query';
import { Form, Formik, FormikHelpers } from 'formik';
import { useRouter } from 'next/navigation';
import React from 'react';
import * as Yup from 'yup';
import { FormSectionTitle } from '@/components/ui/form/FormSection';
import { toaster } from '@/components/ui/toaster';
import SelectBoxBrand from './SelectBoxBrand';
import { useUploadBoxBrandLogo } from '../../hooks/box-brand/uploadBoxBrandLogo';
import { serverErrorMessage } from '../../utils/serverErrorMessage';
import UploadLogoFile from '../producer/UploadLogoFile';

const SUPPORTED_FORMATS = [
  'image/jpeg',
  'image/png',
  'image/gif',
  'image/bmp',
  'image/webp',
  'image/jpg',
];

interface ValuesProps {
  boxBrandId: number | '';
  logoImg: File | null;
}

const initialValues: ValuesProps = {
  boxBrandId: '',
  logoImg: null,
};

const validationSchema = Yup.object().shape({
  boxBrandId: Yup.number().required('Requerido'),
  logoImg: Yup.mixed()
    .required('Se requiere una imagen')
    .test('fileFormat', 'Formato no soportado', (value) => {
      return value && SUPPORTED_FORMATS.includes((value as File).type);
    }),
});

const UploadLogoForm = (): React.JSX.Element => {
  const router = useRouter();
  const { uploadBoxBrandLogo, isPending: isLoading } = useUploadBoxBrandLogo();
  const queryClient = useQueryClient();

  const onSubmit = async (
    values: ValuesProps,
    formikHelpers: FormikHelpers<ValuesProps>
  ): Promise<void> => {
    if (values.logoImg) {
      uploadBoxBrandLogo(
        {
          logoImg: values.logoImg,
          boxBrandId: String(values.boxBrandId),
        },
        {
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
              queryKey: ['boxBrands'],
            });
            formikHelpers.resetForm();
            router.push('/dashboard/box-brands/search');
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
            <FormSectionTitle>Selecciona la marca de caja</FormSectionTitle>
            <SelectBoxBrand name={'boxBrandId'} />

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
