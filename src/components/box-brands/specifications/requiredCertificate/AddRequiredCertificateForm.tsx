/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button, Flex } from '@chakra-ui/react';
import { useQueryClient } from '@tanstack/react-query';
import { Form, Formik } from 'formik';
import React from 'react';
import * as Yup from 'yup';
import { FormSectionTitle } from '@/components/ui/form/FormSection';
import { toaster } from '@/components/ui/toaster';
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
  const { createRequiredCertificate, isPending: isLoading } =
    useCreateRequiredCertificate();
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
          toaster.create({
            title: 'No se pudo guardar',
            description: serverErrorMessage(error),
            type: 'error',
            duration: 5000,
            closable: true,
          });
        },
        onSuccess: () => {
          toaster.create({
            title: 'Certificado creado con éxito',
            type: 'success',
            duration: 5000,
            closable: true,
          });

          queryClient.invalidateQueries({
            queryKey: ['requiredCertificates'],
          });
          actions.resetForm();
          onClose?.();
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
              <FormSectionTitle>Agregar certificado</FormSectionTitle>
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
};

export default AddCertificateForm;
