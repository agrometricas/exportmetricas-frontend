/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Button,
  Divider,
  Flex,
  Heading,
  SimpleGrid,
  useToast,
} from '@chakra-ui/react';
import { Form, Formik, FormikHelpers } from 'formik';
import { useRouter } from 'next/navigation';
import React from 'react';
import { useQueryClient } from 'react-query';
import * as Yup from 'yup';
import SelectBoxBrand from './SelectBoxBrand';
import { useUploadBoxBrandLogo } from '../../hooks/box-brand/uploadBoxBrandLogo';
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
  const toast = useToast();
  const { uploadBoxBrandLogo, isLoading } = useUploadBoxBrandLogo();
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
            const { response } = error;
            const { data } = response;
            const { statusCode, message, error: errorTitle } = data;
            {
              toast({
                title: `Error ${statusCode}: ${errorTitle} `,
                description: `${message}`,
                status: 'error',
                duration: 5000,
                isClosable: true,
              });

              if (statusCode === 401) {
                router.push('/api/auth/signout');
              }
            }
          },
          onSuccess: async () => {
            toast({
              title: 'Imagen Subida con Éxito',
              status: 'success',
              duration: 5000,
              isClosable: true,
            });

            queryClient.invalidateQueries('boxBrands');
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
            <Heading fontSize={'2xl'} p={'12px'}>
              Seleccione la Marca de Caja
            </Heading>
            <Divider mb={'16px'} />
            <SelectBoxBrand name={'boxBrandId'} />

            <Heading fontSize={'2xl'} p={'12px'}>
              Subir Logo
            </Heading>
            <Divider mb={'16px'} />

            <UploadLogoFile name={'logoImg'} />
          </Flex>
          <SimpleGrid columns={{ base: 1, sm: 1 }}>
            <Button
              mt='12px'
              py='8px'
              px='16px'
              type='submit'
              colorScheme='teal'
              isLoading={isLoading}
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
