import { Button, Flex } from '@chakra-ui/react';
import { useQueryClient } from '@tanstack/react-query';
import { Form, Formik } from 'formik';
import React from 'react';
import * as Yup from 'yup';
import { FormSectionTitle } from '@/components/ui/form/FormSection';
import InputFieldText from '@/components/ui/form/InputFieldText';
import { toaster } from '@/components/ui/toaster';
import { useCreatePallet } from '@/hooks/box-brand/materials/pallet/createPallet';
import { qk } from '@/lib/queryKeys';
import { serverErrorMessage } from '../../../../utils/serverErrorMessage';

interface AddPalletFormProps {
  onClose?: () => void;
}

interface ValuesProps {
  name: string;
  code: string;
}

const initialValues: ValuesProps = {
  name: '',
  code: '',
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
    .trim()
    .required('Requerido'),
  code: Yup.string()
    .max(100, 'Debe tener 100 caracteres o menos')
    .min(2, 'Debe tener 2 caracteres o más')
    .matches(/^\S.*\S$/, 'No debe tener espacios al principio ni al final')
    .matches(
      /^(?!.*\s{2,}).*$/,
      'No debe tener múltiples espacios consecutivos'
    )
    .trim()
    .required('Requerido'),
});

const AddPalletForm = ({ onClose }: AddPalletFormProps): React.JSX.Element => {
  const { createPallet, isPending: isLoading } = useCreatePallet();
  const queryClient = useQueryClient();

  const addPallet = async (
    values: ValuesProps,
    actions: { resetForm: () => void }
  ): Promise<void> => {
    createPallet(
      { ...values },
      {
        onError: (error: TypeError) => {
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
            title: 'Pallet creado con éxito',
            type: 'success',
            duration: 5000,
            closable: true,
          });
          queryClient.invalidateQueries({
            queryKey: qk('pallets'),
          });
          actions.resetForm();
          if (onClose) onClose();
        },
      }
    );
  };

  return (
    <Formik
      initialValues={initialValues}
      onSubmit={addPallet}
      validationSchema={validationSchema}
    >
      {() => (
        <Form>
          <Flex flexDirection='column' gap={3}>
            <FormSectionTitle>Agregar pallet</FormSectionTitle>
            <InputFieldText name='name' label='Nombre' />
            <InputFieldText name='code' label='Código' />
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
  );
};

export default AddPalletForm;
