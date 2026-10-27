/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button, Flex } from '@chakra-ui/react';
import { Form, Formik } from 'formik';
import { useRouter } from 'next/navigation';
import React from 'react';
import { useQueryClient } from 'react-query';
import * as Yup from 'yup';
import { FormSectionTitle } from '@/components/ui/form/FormSection';
import { toaster } from '@/components/ui/toaster';
import { useCreateBrand } from '@/hooks/box-brand/specifications/brand/createBrand';
import { serverErrorMessage } from '../../../../utils/serverErrorMessage';
import InputFieldText from '../../../ui/form/InputFieldText';

interface AddBrandFormProps {
  onClose?: () => void;
}

interface ValuesProps {
  name: string;
}

const initialValues: ValuesProps = {
  name: '',
};

const validationSchema = Yup.object({
  name: Yup.string()
    .max(100, 'Debe tener 100 caracteres o menos')
    .min(2, 'Debe tener 2 caracteres o más')
    .required('Requerido'),
});

export default function AddBrandForm({
  onClose,
}: AddBrandFormProps): React.JSX.Element {
  const { createBrand, isLoading } = useCreateBrand();
  const router = useRouter();
  const queryClient = useQueryClient();

  const addBrand = async (
    values: ValuesProps,
    actions: { resetForm: () => void }
  ): Promise<void> => {
    createBrand(
      {
        ...values,
      },
      {
        onError: (error: any) => {
          const statusCode = error.response?.status;
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
        },
        onSuccess: () => {
          toaster.create({
            title: 'Marca Creada con Éxito',
            type: 'success',
            duration: 5000,
            closable: true,
          });

          queryClient.invalidateQueries('brands');
          actions.resetForm();
          !!onClose && onClose();
        },
      }
    );

    return;
  };

  return (
    <>
      <Formik
        initialValues={initialValues}
        onSubmit={addBrand}
        validationSchema={validationSchema}
      >
        {({}) => (
          <Form>
            <Flex flexDirection='column' gap={3}>
              <FormSectionTitle>Agregar Marca de Cajas</FormSectionTitle>
              <InputFieldText name={'name'} label={'Nombre'} />

              <Button
                mt='32px'
                py='8px'
                px='16px'
                type='submit'
                colorPalette='green'
                loading={isLoading}
              >
                Agregar
              </Button>
            </Flex>
          </Form>
        )}
      </Formik>
    </>
  );
}
