/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { Button, Flex } from '@chakra-ui/react';
import { Form, Formik } from 'formik';
import { useRouter } from 'next/navigation';
import React from 'react';
import { useQueryClient } from 'react-query';
import * as Yup from 'yup';
import { FormSectionTitle } from '@/components/ui/form/FormSection';
import { toaster } from '@/components/ui/toaster';
import { useCreatePesticide } from '../../../../hooks/box-brand/post-harvest/pesticide/createPesticide';
import { serverErrorMessage } from '../../../../utils/serverErrorMessage';
import InputFieldNumber from '../../../ui/form/InputFieldNumber';
import InputFieldSelector from '../../../ui/form/InputFieldSelector';
import InputFieldText from '../../../ui/form/InputFieldText';

interface AddPesticideFormProps {
  onClose?: () => void;
}

interface ValuesProps {
  name: string;
  code: string;
  brandName: string;
  activeIngredient: string;
  dose: number | '';
  presentation: string;
}

const initialValues: ValuesProps = {
  name: '',
  code: '',
  brandName: '',
  activeIngredient: '',
  dose: '',
  presentation: '',
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
  brandName: Yup.string()
    .max(50, 'Debe tener 50 caracteres o menos')
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
  presentation: Yup.string()
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

const AddPesticideForm = ({
  onClose,
}: AddPesticideFormProps): React.JSX.Element => {
  const { createPesticide, isLoading } = useCreatePesticide();
  const router = useRouter();
  const queryClient = useQueryClient();

  const addPesticide = async (
    values: ValuesProps,
    actions: { resetForm: () => void }
  ): Promise<void> => {
    const { dose, ...pesticideData } = values;

    createPesticide(
      {
        ...pesticideData,
        dose: Number(values.dose),
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
            title: 'Pesticida creado con éxito',
            type: 'success',
            duration: 5000,
            closable: true,
          });

          queryClient.invalidateQueries('pesticides');
          actions.resetForm();
          !!onClose && onClose();
        },
      }
    );

    return;
  };

  const PresentationOptions = [
    { id: 'Mililitro (mL / cc)', name: 'Mililitro (mL / cc)' },
    { id: 'Centilitro (cL)', name: 'Centilitro (cL)' },
    { id: 'Decilitro (dL)', name: 'Decilitro (dL)' },
    { id: 'Litro (L)', name: 'Litro (L)' },
    { id: 'Galón (US gal)', name: 'Galón (US gal)' },
    { id: 'Miligramo (mg)', name: 'Miligramo (mg)' },
    { id: 'Gramo (g)', name: 'Gramo (g)' },
    { id: 'Kilogramo (kg)', name: 'Kilogramo (kg)' },
    { id: 'Onza (oz)', name: 'Onza (oz)' },
    { id: 'Libra (lb)', name: 'Libra (lb)' },
    { id: 'Quintal (qq)', name: 'Quintal (qq)' },
    { id: 'Unidad (un)', name: 'Unidad (un)' },
  ];

  return (
    <>
      <Formik
        initialValues={initialValues}
        onSubmit={addPesticide}
        validationSchema={validationSchema}
      >
        {({ isSubmitting }) => (
          <Form>
            <Flex flexDirection='column' gap={3}>
              <FormSectionTitle>
                Agregar Pesticida
              </FormSectionTitle>
              <InputFieldText name={'name'} label={'Nombre'} />
              <InputFieldText name={'code'} label={'Código'} />
              <InputFieldText name={'brandName'} label={'Nombre comercial'} />
              <InputFieldText
                name={'activeIngredient'}
                label={'Ingrediente activo'}
              />
              <InputFieldNumber name={'dose'} label={'Dosis'} />
              <InputFieldSelector
                name={'presentation'}
                label={'Presentación'}
                options={PresentationOptions}
              />
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

export default AddPesticideForm;
