/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button, Divider, Flex, Heading, useToast } from '@chakra-ui/react';
import { Form, Formik } from 'formik';
import { useRouter } from 'next/navigation';
import React from 'react';
import { useQueryClient } from 'react-query';
import * as Yup from 'yup';
import { useCreateRequiredCertificate } from '../../../../hooks/box-brand/specifications/certificate/createRequiredCertificate';
import { serverErrorMessage } from '../../../../utils/serverErrorMessage';
import InputFieldText from '../../../ui/form/InputFieldText';

interface AddCertificateFormProps {
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
    .matches(/^\S.*\S$/, 'No debe tener espacios al principio ni al final')
    .matches(
      /^(?!.*\s{2,}).*$/,
      'No debe tener múltiples espacios consecutivos'
    )
    .transform((value) => value.trim())
    .required('Requerido'),
});

const AddCertificateForm = ({
  onClose,
}: AddCertificateFormProps): React.JSX.Element => {
  const { createRequiredCertificate, isLoading } =
    useCreateRequiredCertificate();
  const toast = useToast();
  const router = useRouter();
  const queryClient = useQueryClient();

  const addCertificate = async (
    values: ValuesProps,
    actions: { resetForm: () => void }
  ): Promise<void> => {
    createRequiredCertificate(
      {
        ...values,
      },
      {
        onError: (error: any) => {
          const statusCode = error.response?.status;

          toast({
            title: 'No se pudo guardar',
            description: serverErrorMessage(error),
            status: 'error',
            duration: 5000,
            isClosable: true,
          });

          if (statusCode === 401) {
            router.push('/api/auth/signout');
          }
        },
        onSuccess: () => {
          toast({
            title: 'Certificado Creado con Éxito',
            status: 'success',
            duration: 5000,
            isClosable: true,
          });

          queryClient.invalidateQueries('requiredCertificates');
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
        onSubmit={addCertificate}
        validationSchema={validationSchema}
      >
        {({}) => (
          <Form>
            <Flex flexDirection='column' gap={3}>
              <Heading fontSize={'2xl'} p={'12px'}>
                Agregar Certificado
              </Heading>
              <Divider mb={'16px'} />
              <InputFieldText name={'name'} label={'Nombre'} />

              <Button
                mt='32px'
                py='8px'
                px='16px'
                type='submit'
                colorScheme='teal'
                isLoading={isLoading}
              >
                Agregar
              </Button>
            </Flex>
          </Form>
        )}
      </Formik>
    </>
  );
};

export default AddCertificateForm;
