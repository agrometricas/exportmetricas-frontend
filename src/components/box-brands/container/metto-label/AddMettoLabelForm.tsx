/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button, Flex } from '@chakra-ui/react';
import { useQueryClient } from '@tanstack/react-query';
import { Form, Formik } from 'formik';
import { useRouter } from 'next/navigation';
import React from 'react';
import * as Yup from 'yup';
import { FormSectionTitle } from '@/components/ui/form/FormSection';
import { toaster } from '@/components/ui/toaster';
import { useCreateMettoLabel } from '../../../../hooks/box-brand/container/metto-label/createMettoLabel';
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

interface AddMettoLabelFormProps {
  onClose?: () => void;
}

interface ValuesProps {
  name: string;
  quantityPerPack: number | '';
  art: File | null;
  code: string;
}

const initialValues: ValuesProps = {
  name: '',
  quantityPerPack: '',
  art: null,
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
  quantityPerPack: Yup.number()
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
  code: Yup.string()
    .max(50, 'Debe tener 50 caracteres o menos')
    .matches(/^[a-zA-Z0-9]+$/, 'Solo debe contener letras y números')
    .transform((value) => value.trim())
    .required('Requerido'),
});

const AddMettoLabelForm = ({
  onClose,
}: AddMettoLabelFormProps): React.JSX.Element => {
  const { createMettoLabel, isPending: isLoading } = useCreateMettoLabel();
  const router = useRouter();
  const queryClient = useQueryClient();

  const AddMettoLabel = async (
    values: ValuesProps,
    actions: { resetForm: () => void }
  ): Promise<void> => {
    const formData = {
      name: values.name,
      quantityPerPack: Number(values.quantityPerPack),
      code: values.code,
      art: values.art,
    };
    createMettoLabel(formData, {
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
          title: 'Etiqueta Metto creada con éxito',
          type: 'success',
          duration: 5000,
          closable: true,
        });
        queryClient.invalidateQueries({
          queryKey: ['mettoLabels']
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
        onSubmit={AddMettoLabel}
        validationSchema={validationSchema}
      >
        {({}) => (
          <Form>
            <Flex flexDirection='column' gap={3}>
              <FormSectionTitle>
                Agregar etiqueta Metto
              </FormSectionTitle>
              <InputFieldText name={'name'} label={'Nombre'} />
              <InputFieldText name={'code'} label={'Código'} />
              <InputFieldNumber
                name={'quantityPerPack'}
                label={'Cantidad por funda'}
              />
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

export default AddMettoLabelForm;
