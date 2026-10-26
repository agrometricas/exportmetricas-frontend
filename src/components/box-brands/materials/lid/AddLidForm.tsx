import { Button, Divider, Flex, Heading, useToast } from '@chakra-ui/react';
import { Form, Formik } from 'formik';
import React from 'react';
import { useQueryClient } from 'react-query';
import * as Yup from 'yup';
import InputFieldText from '@/components/ui/form/InputFieldText';
import { useCreateLid } from '@/hooks/box-brand/materials/lid/createLid';
import { serverErrorMessage } from '../../../../utils/serverErrorMessage';

interface AddLidFormProps {
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
    .transform((value) => value.trim())
    .required('Requerido'),
  code: Yup.string()
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

const AddLidForm = ({ onClose }: AddLidFormProps): React.JSX.Element => {
  const { createLid, isLoading } = useCreateLid();
  const toast = useToast();
  const queryClient = useQueryClient();

  const addLid = async (
    values: ValuesProps,
    actions: { resetForm: () => void }
  ): Promise<void> => {
    const { ...lidData } = values;

    createLid(
      { ...lidData },
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
            title: 'Tapa creada con Éxito',
            status: 'success',
            duration: 5000,
            isClosable: true,
          });
          queryClient.invalidateQueries('lids');
          actions.resetForm();
          !!onClose && onClose();
        },
      }
    );
  };

  return (
    <Formik
      initialValues={initialValues}
      onSubmit={addLid}
      validationSchema={validationSchema}
    >
      {({}) => (
        <Form>
          <Flex flexDirection='column' gap={3}>
            <Heading fontSize='2xl' p='12px'>
              Agregar Tapa
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

export default AddLidForm;
