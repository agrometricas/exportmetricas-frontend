/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button, Flex } from '@chakra-ui/react';
import { useQueryClient } from '@tanstack/react-query';
import { Form, Formik } from 'formik';
import { useRouter } from 'next/navigation';
import React from 'react';
import * as Yup from 'yup';
import { FormSectionTitle } from '@/components/ui/form/FormSection';
import { toaster } from '@/components/ui/toaster';
import { useCreateStripping } from '../../../../hooks/box-brand/container/stripping/createStripping';
import { serverErrorMessage } from '../../../../utils/serverErrorMessage';
import InputFieldNumber from '../../../ui/form/InputFieldNumber';
import InputFieldText from '../../../ui/form/InputFieldText';

interface AddStrippingFormProps {
  onClose?: () => void;
}

interface ValuesProps {
  name: string;
  code: string;
  weightPerPack: number | '';
  color: string;
}

const initialValues: ValuesProps = {
  name: '',
  code: '',
  weightPerPack: '',
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
  weightPerPack: Yup.number()
    .moreThan(0, 'Debe ser mayor que 0')
    .lessThan(10000, 'Debe ser menor que 10000 ')
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

const AddStrippingForm = ({
  onClose,
}: AddStrippingFormProps): React.JSX.Element => {
  const { createStripping, isPending: isLoading } = useCreateStripping();
  const router = useRouter();
  const queryClient = useQueryClient();

  const addStripping = async (
    values: ValuesProps,
    actions: { resetForm: () => void }
  ): Promise<void> => {
    const { weightPerPack, ...strippingData } = values;

    createStripping(
      {
        ...strippingData,
        weightPerPack: Number(weightPerPack),
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
            title: 'Zuncho creado con éxito',
            type: 'success',
            duration: 5000,
            closable: true,
          });

          queryClient.invalidateQueries({
            queryKey: ['strippings'],
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
        onSubmit={addStripping}
        validationSchema={validationSchema}
      >
        {() => (
          <Form>
            <Flex flexDirection='column' gap={3}>
              <FormSectionTitle>Agregar zuncho</FormSectionTitle>
              <InputFieldText name={'name'} label={'Nombre'} />
              <InputFieldText name={'code'} label={'Código'} />
              <InputFieldNumber
                name={'weightPerPack'}
                label={'Peso por rollo'}
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

export default AddStrippingForm;
