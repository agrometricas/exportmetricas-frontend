/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button, Flex } from '@chakra-ui/react';
import { Form, Formik } from 'formik';
import { useRouter } from 'next/navigation';
import React from 'react';
import { useQueryClient } from 'react-query';
import * as Yup from 'yup';
import { FormSectionTitle } from '@/components/ui/form/FormSection';
import { toaster } from '@/components/ui/toaster';
import { useCreateRubber } from '../../../../hooks/box-brand/materials/rubber/createRubber';
import { serverErrorMessage } from '../../../../utils/serverErrorMessage';
import InputFieldNumber from '../../../ui/form/InputFieldNumber';
import InputFieldText from '../../../ui/form/InputFieldText';

interface AddRubberFormProps {
  onClose?: () => void;
}

interface ValuesProps {
  name: string;
  code: string;
  quantityPerPack: number | '';
  color: string;
}

const initialValues: ValuesProps = {
  name: '',
  code: '',
  quantityPerPack: '',
  color: '',
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
    .max(10, 'Debe tener 10 caracteres o menos')
    .min(2, 'Debe tener 2 caracteres o más')
    .matches(/^\S.*\S$/, 'No debe tener espacios al principio ni al final')
    .matches(
      /^(?!.*\s{2,}).*$/,
      'No debe tener múltiples espacios consecutivos'
    )
    .transform((value) => value.trim())
    .required('Requerido'),
  quantityPerPack: Yup.number()
    .integer('Debe ser un número entero')
    .moreThan(0, 'Debe ser mayor que 0')
    .lessThan(10000, 'Debe ser menor que 10000')
    .required('Requerido'),
  color: Yup.string()
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

const AddRubberForm = ({ onClose }: AddRubberFormProps): React.JSX.Element => {
  const { createRubber, isLoading } = useCreateRubber();
  const router = useRouter();
  const queryClient = useQueryClient();

  const addRubber = async (
    values: ValuesProps,
    actions: { resetForm: () => void }
  ): Promise<void> => {
    const { quantityPerPack, ...rubberData } = values;
    createRubber(
      {
        ...rubberData,
        quantityPerPack: Number(quantityPerPack),
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
            title: 'Liga creada con éxito',
            type: 'success',
            duration: 5000,
            closable: true,
          });

          queryClient.invalidateQueries('rubbers');
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
        onSubmit={addRubber}
        validationSchema={validationSchema}
      >
        {() => (
          <Form>
            <Flex flexDirection='column' gap={3}>
              <FormSectionTitle>Agregar liga</FormSectionTitle>
              <InputFieldText name={'name'} label={'Nombre'} />
              <InputFieldText name={'code'} label={'Código'} />
              <InputFieldNumber
                name={'quantityPerPack'}
                label={'Cantidad por funda'}
              />
              <InputFieldText name={'color'} label={'Color'} />

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

export default AddRubberForm;
