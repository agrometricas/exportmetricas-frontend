import { Button, Divider, Flex, Heading, useToast } from '@chakra-ui/react';
import { Form, Formik } from 'formik';
import React from 'react';
import { useQueryClient } from 'react-query';
import * as Yup from 'yup';
import { useCreateBoardingCard } from '../../../../hooks/box-brand/additions/boarding-card/createBoardingCard';
import { serverErrorMessage } from '../../../../utils/serverErrorMessage';
import InputFieldText from '../../../ui/form/InputFieldText';

interface AddBoardingCardFormProps {
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

const AddBoardingCardForm = ({
  onClose,
}: AddBoardingCardFormProps): React.JSX.Element => {
  const { mutate: createBoardingCard, isLoading } = useCreateBoardingCard();
  const toast = useToast();
  const queryClient = useQueryClient();

  const addBoardingCard = async (
    values: ValuesProps,
    actions: { resetForm: () => void }
  ): Promise<void> => {
    createBoardingCard(
      {
        ...values,
      },
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
            title: 'Tarjeta de Embarque Creada con Éxito',
            status: 'success',
            duration: 5000,
            isClosable: true,
          });

          queryClient.invalidateQueries('boardingCards');
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
        onSubmit={addBoardingCard}
        validationSchema={validationSchema}
      >
        {({}) => (
          <Form>
            <Flex flexDirection='column' gap={3}>
              <Heading fontSize={'2xl'} p={'12px'}>
                Agregar Tarjeta de Embarque
              </Heading>
              <Divider mb={'16px'} />
              <InputFieldText name={'name'} label={'Nombre'} />
              <InputFieldText name={'code'} label={'Codigo'} />
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

export default AddBoardingCardForm;
