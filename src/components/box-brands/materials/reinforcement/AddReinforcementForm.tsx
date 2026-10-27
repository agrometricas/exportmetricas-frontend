import { Button, Flex } from '@chakra-ui/react';
import { Form, Formik } from 'formik';
import React from 'react';
import { useQueryClient } from 'react-query';
import * as Yup from 'yup';
import { FormSectionTitle } from '@/components/ui/form/FormSection';
import InputFieldText from '@/components/ui/form/InputFieldText';
import { toaster } from '@/components/ui/toaster';
import { useCreateReinforcement } from '@/hooks/box-brand/materials/reinforcement/createReinforcement';
import { serverErrorMessage } from '../../../../utils/serverErrorMessage';

interface AddReinforcementFormProps {
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

const AddReinforcementForm = ({
  onClose,
}: AddReinforcementFormProps): React.JSX.Element => {
  const { createReinforcement, isLoading } = useCreateReinforcement();
  const queryClient = useQueryClient();

  const addReinforcement = async (
    values: ValuesProps,
    actions: { resetForm: () => void }
  ): Promise<void> => {
    createReinforcement(
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
            title: 'Reinforcement creado con éxito',
            type: 'success',
            duration: 5000,
            closable: true,
          });
          queryClient.invalidateQueries('reinforcements');
          actions.resetForm();
          if (onClose) onClose();
        },
      }
    );
  };

  return (
    <Formik
      initialValues={initialValues}
      onSubmit={addReinforcement}
      validationSchema={validationSchema}
    >
      {() => (
        <Form>
          <Flex flexDirection='column' gap={3}>
            <FormSectionTitle>Agregar reinforcement</FormSectionTitle>
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

export default AddReinforcementForm;
