import { Button, Divider, Flex, Heading, useToast } from '@chakra-ui/react';
import { Form, Formik } from 'formik';
import React from 'react';
import { useQueryClient } from 'react-query';
import * as Yup from 'yup';
import InputFieldText from '@/components/ui/form/InputFieldText';
import { useCreatePallet } from '@/hooks/box-brand/materials/pallet/createPallet';
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
  const { createPallet, isLoading } = useCreatePallet();
  const toast = useToast();
  const queryClient = useQueryClient();

  const addPallet = async (
    values: ValuesProps,
    actions: { resetForm: () => void }
  ): Promise<void> => {
    createPallet(
      { ...values },
      {
        onError: (error: TypeError) => {
          toast({
            title: 'No se pudo guardar',
            description: serverErrorMessage(error),
            status: 'error',
            duration: 5000,
            isClosable: true,
          });
        },
        onSuccess: () => {
          toast({
            title: 'Pallet creado con Éxito',
            status: 'success',
            duration: 5000,
            isClosable: true,
          });
          queryClient.invalidateQueries('pallets');
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
            <Heading fontSize='2xl' p='12px'>
              Agregar Pallet
            </Heading>
            <Divider mb='16px' />
            <InputFieldText name='name' label='Nombre' />
            <InputFieldText name='code' label='Código' />
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
  );
};

export default AddPalletForm;
