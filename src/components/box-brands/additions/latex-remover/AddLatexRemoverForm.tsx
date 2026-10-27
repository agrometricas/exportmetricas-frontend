/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button, Flex } from '@chakra-ui/react';
import { Form, Formik } from 'formik';
import { useRouter } from 'next/navigation';
import React from 'react';
import { useQueryClient } from 'react-query';
import * as Yup from 'yup';
import { FormSectionTitle } from '@/components/ui/form/FormSection';
import { toaster } from '@/components/ui/toaster';
import { useCreateLatexRemover } from '../../../../hooks/box-brand/additions/latex-remover/createLatexRemover';
import { serverErrorMessage } from '../../../../utils/serverErrorMessage';
import InputFieldNumber from '../../../ui/form/InputFieldNumber';
import InputFieldText from '../../../ui/form/InputFieldText';

interface AddLatexRemoverFormProps {
  onClose?: () => void;
}

interface ValuesProps {
  name: string;
  code: string;
  activeIngredient: string;
  dose: number | '';
}

const initialValues: ValuesProps = {
  name: '',
  code: '',
  activeIngredient: '',
  dose: '',
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
  activeIngredient: Yup.string()
    .max(100, 'Debe tener 100 caracteres o menos')
    .min(2, 'Debe tener 2 caracteres o más')
    .matches(/^\S.*\S$/, 'No debe tener espacios al principio ni al final')
    .matches(
      /^(?!.*\s{2,}).*$/,
      'No debe tener múltiples espacios consecutivos'
    )
    .transform((value) => value.trim())
    .required('Requerido'),
  dose: Yup.number()
    .moreThan(0, 'Debe ser mayor que 0')
    .lessThan(10000, 'Debe ser menor que 10000 ')
    .test(
      'is-decimal',
      'Debe tener como máximo 3 decimales',
      (value) => (value + '').match(/^\d+(\.\d{1,3})?$/) !== null
    )
    .required('Requerido'),
});

const AddLatexRemoverForm = ({
  onClose,
}: AddLatexRemoverFormProps): React.JSX.Element => {
  const { createLatexRemover, isLoading } = useCreateLatexRemover();
  const router = useRouter();
  const queryClient = useQueryClient();

  const addLatexRemover = async (
    values: ValuesProps,
    actions: { resetForm: () => void }
  ): Promise<void> => {
    const { dose, ...latexRemoverData } = values;

    createLatexRemover(
      {
        ...latexRemoverData,
        dose: Number(dose),
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
            title: 'Removedor de latex creado con éxito',
            type: 'success',
            duration: 5000,
            closable: true,
          });

          queryClient.invalidateQueries('latexRemovers');
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
        onSubmit={addLatexRemover}
        validationSchema={validationSchema}
      >
        {() => (
          <Form>
            <Flex flexDirection='column' gap={3}>
              <FormSectionTitle>Agregar removedor de latex</FormSectionTitle>
              <InputFieldText name={'name'} label={'Nombre'} />
              <InputFieldText name={'code'} label={'Código'} />
              <InputFieldText
                name={'activeIngredient'}
                label={'Ingrediente activo'}
              />
              <InputFieldNumber name={'dose'} label={'Dosis'} />

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

export default AddLatexRemoverForm;
