import { Button, Flex } from '@chakra-ui/react';
import { useQueryClient } from '@tanstack/react-query';
import { Form, Formik } from 'formik';
import React from 'react';
import * as Yup from 'yup';
import { FormSectionTitle } from '@/components/ui/form/FormSection';
import { toaster } from '@/components/ui/toaster';
import { useCreateClusterBag } from '../../../../hooks/box-brand/materials/cluster-bag/createClusterBag';
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

interface AddClusterBagFormProps {
  onClose?: () => void;
}

interface ValuesProps {
  name: string;
  code: string;
  art: File | null;
  dimensions: string;
  quantityPerPack: number | '';
}

const initialValues: ValuesProps = {
  name: '',
  code: '',
  art: null,
  dimensions: '',
  quantityPerPack: '',
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
  art: Yup.mixed()
    .notRequired()
    .test('fileFormat', 'Formato no soportado', (value) => {
      if (!value) return true;
      if (value instanceof File) {
        return SUPPORTED_FORMATS.includes(value.type);
      }
      return false;
    }),
  dimensions: Yup.string()
    .max(50, 'Debe tener 50 caracteres o menos')
    .required('Requerido'),
  quantityPerPack: Yup.number()
    .integer('Debe ser un número entero')
    .moreThan(0, 'Debe ser mayor que 0')
    .lessThan(10000, 'Debe ser menor que 10000')
    .required('Requerido'),
});

const AddClusterBagForm = ({
  onClose,
}: AddClusterBagFormProps): React.JSX.Element => {
  const { createClusterBag, isPending: isLoading } = useCreateClusterBag();
  const queryClient = useQueryClient();

  const addClusterBag = async (
    values: ValuesProps,
    actions: { resetForm: () => void }
  ): Promise<void> => {
    const formData = {
      name: values.name,
      code: values.code,
      quantityPerPack: Number(values.quantityPerPack),
      dimensions: values.dimensions,
      art: values.art,
    };

    createClusterBag(formData, {
      onError: (error) => {
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
          title: 'Cluster bag creado con éxito',
          type: 'success',
          duration: 5000,
          closable: true,
        });

        queryClient.invalidateQueries({
          queryKey: ['clusterBags'],
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
        onSubmit={addClusterBag}
        validationSchema={validationSchema}
      >
        {({}) => (
          <Form>
            <Flex flexDirection='column' gap={3}>
              <FormSectionTitle>Agregar cluster bag</FormSectionTitle>
              <InputFieldText name={'name'} label={'Nombre'} />
              <InputFieldText name={'code'} label={'Código'} />
              <InputFieldText name={'dimensions'} label={'Dimensiones'} />
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

export default AddClusterBagForm;
