/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button, Flex } from '@chakra-ui/react';
import { useQueryClient } from '@tanstack/react-query';
import { Form, Formik } from 'formik';
import { useRouter } from 'next/navigation';
import React from 'react';
import * as Yup from 'yup';
import { FormSectionTitle } from '@/components/ui/form/FormSection';
import { toaster } from '@/components/ui/toaster';
import { useCreateLabel } from '../../../../hooks/box-brand/materials/label/createLabel';
import { serverErrorMessage } from '../../../../utils/serverErrorMessage';
import UploadLogoFile from '../../../producer/UploadLogoFile';
import { FormLabel } from '../../../ui/form/FormLabel';
import InputFieldNumber from '../../../ui/form/InputFieldNumber';
import InputFieldText from '../../../ui/form/InputFieldText';

const SUPPORTED_FORMATS = [
  'image/jpeg',
  'image/png',
  'image/gif',
  'image/bmp',
  'image/webp',
  'image/jpg',
];

interface AddLabelFormProps {
  onClose?: () => void;
}

interface ValuesProps {
  name: string;
  code: string;
  quantityPerRoll: number | '';
  art: File | null;
  description: string;
}

const initialValues: ValuesProps = {
  name: '',
  code: '',
  quantityPerRoll: '',
  art: null,
  description: '',
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
  quantityPerRoll: Yup.number()
    .integer('Debe ser un número entero')
    .moreThan(0, 'Debe ser mayor que 0')
    .lessThan(10000, 'Debe ser menor que 10000 ')
    .required('Requerido'),
  art: Yup.mixed()
    .notRequired()
    .test('fileFormat', 'Formato no soportado', (value) => {
      if (!value) return true;
      if (value instanceof File) {
        return SUPPORTED_FORMATS.includes(value.type);
      }
      return false;
    }),
  description: Yup.string()
    .max(200, 'Debe tener 200 caracteres o menos')
    .min(10, 'Debe tener 10 caracteres o más'),
});

const AddLabelForm = ({ onClose }: AddLabelFormProps): React.JSX.Element => {
  const { createLabel, isPending: isLoading } = useCreateLabel();
  const router = useRouter();
  const queryClient = useQueryClient();

  const addLabel = async (
    values: ValuesProps,
    actions: { resetForm: () => void }
  ): Promise<void> => {
    const formData = {
      name: values.name,
      code: values.code,
      quantityPerRoll: Number(values.quantityPerRoll),
      description: values.description,
      art: values.art,
    };

    createLabel(formData, {
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
          title: 'Etiqueta creada con éxito',
          type: 'success',
          duration: 5000,
          closable: true,
        });

        queryClient.invalidateQueries({
          queryKey: ['labels']
        });
        actions.resetForm();
        onClose?.();
      },
    });
    return;
  };

  return (
    <>
      <Formik
        initialValues={initialValues}
        onSubmit={addLabel}
        validationSchema={validationSchema}
      >
        {({}) => (
          <Form>
            <Flex flexDirection='column' gap={3}>
              <FormSectionTitle>
                Agregar Etiqueta
              </FormSectionTitle>
              <InputFieldText name={'name'} label={'Nombre'} />
              <InputFieldText name={'code'} label={'Codigo'} />
              <InputFieldNumber
                name={'quantityPerRoll'}
                label={'Cantidad por rollo'}
              />
              <InputFieldText name={'description'} label={'Descripción'} />
              <FormLabel fontSize='sm' mb={0}>
                Arte
              </FormLabel>
              <UploadLogoFile name={'art'} />
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

export default AddLabelForm;
